import { LIQUIDS } from "../data/default-liquids";
import { RECIPES } from "../data/default-recipes";
import { cpk } from "./cpk-engine";
import { liquidFromPhase, nextPhase, PHASES } from "./line-state-machine";
import type {
  AlarmEvent,
  ControllerTag,
  Interlock,
  LiquidId,
  Recipe,
  SimulationSnapshot,
} from "./types";

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function emptyDoses(): Record<LiquidId, number> {
  return { A: 0, B: 0, C: 0 };
}

export class PrecisionFlowEngine {
  running = false;
  phaseIndex = 0;
  scanMs = 50;
  scanCount = 0;
  batchId = `B${Date.now().toString(36).toUpperCase()}`;
  recipe: Recipe = RECIPES.standard!;
  random = rng(Date.now());
  actual = emptyDoses();
  dripLossMg = emptyDoses();
  alarms: AlarmEvent[] = [];
  history: Array<{ scan: number; phase: string; actual: Record<LiquidId, number> }> = [];
  samples: Record<LiquidId, number[]> = { A: [], B: [], C: [] };
  interlocks: Interlock[] = [];
  tags: ControllerTag[] = [];

  constructor() {
    this.reset();
  }

  reset() {
    this.running = false;
    this.phaseIndex = 0;
    this.scanCount = 0;
    this.batchId = `B${Date.now().toString(36).toUpperCase()}`;
    this.recipe = RECIPES.standard!;
    this.random = rng(Date.now());
    this.actual = emptyDoses();
    this.dripLossMg = emptyDoses();
    this.alarms = [];
    this.history = [];
    this.samples = { A: [], B: [], C: [] };
    this.interlocks = this.buildInterlocks();
    this.tags = this.buildTags();
  }

  buildInterlocks(): Interlock[] {
    return [
      { id: "vent_ok", label: "Local exhaust ventilation OK", pass: true },
      { id: "lel", label: "LEL below action level", pass: true },
      { id: "containment", label: "Secondary containment armed", pass: true },
      { id: "esd", label: "Emergency shutdown circuit healthy", pass: true },
      { id: "hazard_profile", label: "Hazard profile complete", pass: this.recipe.hazardProfileComplete },
      { id: "door", label: "Guard door closed", pass: true },
    ];
  }

  buildTags(): ControllerTag[] {
    return [
      { name: "Line.Running", value: false, type: "BOOL" },
      { name: "Line.Phase", value: "idle", type: "STRING" },
      { name: "Line.ScanMs", value: this.scanMs, type: "REAL" },
      { name: "Dose.A.Target_g", value: this.recipe.targets.A, type: "REAL" },
      { name: "Dose.A.Actual_g", value: 0, type: "REAL" },
      { name: "Dose.B.Target_g", value: this.recipe.targets.B, type: "REAL" },
      { name: "Dose.B.Actual_g", value: 0, type: "REAL" },
      { name: "Dose.C.Target_g", value: this.recipe.targets.C, type: "REAL" },
      { name: "Dose.C.Actual_g", value: 0, type: "REAL" },
      { name: "QA.Cpk_A", value: 0, type: "REAL" },
      { name: "QA.Cpk_B", value: 0, type: "REAL" },
      { name: "QA.Cpk_C", value: 0, type: "REAL" },
      { name: "Safety.ESD", value: false, type: "BOOL" },
      { name: "Safety.DripLoss_mg", value: 0, type: "REAL" },
    ];
  }

  setRecipe(id: string) {
    this.recipe = RECIPES[id] ?? RECIPES.standard!;
    this.interlocks = this.buildInterlocks();
    this.syncTags();
  }

  syncTags() {
    const set = (name: string, value: boolean | number | string) => {
      const tag = this.tags.find((t) => t.name === name);
      if (tag) tag.value = value;
    };

    set("Line.Running", this.running);
    set("Line.Phase", PHASES[this.phaseIndex]!);
    set("Dose.A.Target_g", this.recipe.targets.A);
    set("Dose.B.Target_g", this.recipe.targets.B);
    set("Dose.C.Target_g", this.recipe.targets.C);
    set("Dose.A.Actual_g", this.actual.A);
    set("Dose.B.Actual_g", this.actual.B);
    set("Dose.C.Actual_g", this.actual.C);

    (["A", "B", "C"] as LiquidId[]).forEach((L) => {
      const stats = cpk(this.samples[L], this.recipe.targets[L], this.recipe.tolerancePct);
      set(`QA.Cpk_${L}`, Number(stats.cpk.toFixed(2)));
    });

    set(
      "Safety.DripLoss_mg",
      this.dripLossMg.A + this.dripLossMg.B + this.dripLossMg.C,
    );
  }

  alarm(priority: AlarmEvent["priority"], message: string) {
    this.alarms.unshift({ time: new Date().toISOString(), priority, message });
    this.alarms = this.alarms.slice(0, 12);
  }

  start(): boolean {
    if (!this.recipe.hazardProfileComplete) {
      this.alarm("HIGH", "Recipe blocked: hazard profile incomplete.");
      return false;
    }
    if (this.running) return true;
    this.running = true;
    this.phaseIndex = 1;
    this.batchId = `B${Date.now().toString(36).toUpperCase()}`;
    this.actual = emptyDoses();
    this.alarm("LOW", `Batch ${this.batchId} started — ${this.recipe.name}`);
    this.syncTags();
    return true;
  }

  stop() {
    this.running = false;
    this.phaseIndex = 0;
    this.syncTags();
  }

  tick() {
    if (!this.running) return;

    this.scanCount += 1;
    const phase = PHASES[this.phaseIndex]!;
    const tol = this.recipe.tolerancePct / 100;

    if (phase.startsWith("dose_")) {
      const liquid = liquidFromPhase(phase);
      if (liquid) {
        const target = this.recipe.targets[liquid];
        const rate = target / 8;
        this.actual[liquid] = Math.min(
          target * (1 + tol * 0.3),
          this.actual[liquid] + rate * (0.9 + this.random() * 0.2),
        );
        if (Math.random() < 0.02) {
          this.dripLossMg[liquid] += 0.05 + this.random() * 0.15;
        }
      }
    }

    if (phase.startsWith("verify_")) {
      const liquid = liquidFromPhase(phase);
      if (liquid) {
        const target = this.recipe.targets[liquid];
        const errorPct = ((this.actual[liquid] - target) / target) * 100;
        this.samples[liquid].push(this.actual[liquid]);
        if (Math.abs(errorPct) > this.recipe.tolerancePct) {
          this.alarm(
            "HIGH",
            `${liquid} dose ${errorPct.toFixed(2)}% outside ±${this.recipe.tolerancePct}%`,
          );
          this.phaseIndex = PHASES.indexOf("qa_hold");
        }
      }
    }

    if (phase === "mix" && this.random() < 0.01) {
      const lel = this.interlocks.find((i) => i.id === "lel");
      if (lel) lel.pass = false;
      this.alarm("HIGH", "LEL rising — ventilation interlock review");
    }

    if (phase === "release") {
      const stats = (["A", "B", "C"] as LiquidId[]).map((L) =>
        cpk(this.samples[L], this.recipe.targets[L], this.recipe.tolerancePct),
      );
      const pass = stats.every((s) => s.cpk >= this.recipe.cpkTarget);
      const drip = this.dripLossMg.A + this.dripLossMg.B + this.dripLossMg.C;
      if (!pass) this.alarm("MED", "Cpk below target — batch held for QA review");
      if (drip > 1.5) {
        this.alarm("MED", `Drip loss ledger ${drip.toFixed(2)} mg exceeds screening threshold`);
      }
      if (pass && drip <= 1.5) {
        this.alarm("LOW", `Batch ${this.batchId} released`);
      }
    }

    const transition = nextPhase(this.phaseIndex);
    this.phaseIndex = transition.index;
    this.running = transition.running;

    this.history.push({ scan: this.scanCount, phase, actual: { ...this.actual } });
    this.history = this.history.slice(-120);
    this.syncTags();
  }

  snapshot(): SimulationSnapshot {
    this.syncTags();
    return {
      running: this.running,
      phase: PHASES[this.phaseIndex]!,
      scanCount: this.scanCount,
      scanMs: this.scanMs,
      batchId: this.batchId,
      recipe: { ...this.recipe, targets: { ...this.recipe.targets } },
      actual: { ...this.actual },
      dripLossMg: { ...this.dripLossMg },
      tags: this.tags.map((t) => ({ ...t })),
      alarms: [...this.alarms],
      interlocks: this.interlocks.map((i) => ({ ...i })),
      samples: {
        A: [...this.samples.A],
        B: [...this.samples.B],
        C: [...this.samples.C],
      },
      liquids: LIQUIDS,
      recipes: RECIPES,
    };
  }
}
