import { LIQUIDS } from "../data/default-liquids";
import { RECIPES } from "../data/default-recipes";
import { PREHEAT_LOOPS } from "../data/facility-layout";
import {
  GRACO_PD2K_3K,
  PRODUCTION_SYSTEMS,
  dosePhaseTicks,
  gramsToMl,
  stationFlowMlMin,
} from "../data/production-system";
import { cpk } from "./cpk-engine";
import { liquidFromPhase, PHASES } from "./line-state-machine";
import { createPreheatState, tickPreheat } from "./preheat-engine";
import type {
  AlarmEvent,
  ConsumptionLedger,
  ControllerTag,
  CpkHistoryPoint,
  Interlock,
  LiquidId,
  LinePhase,
  PreheatState,
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

function emptyLedger(system = GRACO_PD2K_3K): ConsumptionLedger {
  const targetGrams = emptyDoses();
  const dispensedGrams = emptyDoses();
  const dripLossMg = emptyDoses();
  const purgeLossGrams = emptyDoses();
  const totalConsumedGrams = emptyDoses();
  const tankRemainingMl: Record<LiquidId, number> = {
    A: system.tankCapacityMl.A,
    B: system.tankCapacityMl.B,
    C: system.tankCapacityMl.C,
  };
  return {
    targetGrams,
    dispensedGrams,
    dripLossMg,
    purgeLossGrams,
    totalConsumedGrams,
    tankRemainingMl,
  };
}

export class PrecisionFlowEngine {
  running = false;
  phaseIndex = 0;
  phaseTicksRemaining = 0;
  baseScanMs = GRACO_PD2K_3K.scanCycleMs;
  speedFactor = 1;
  scanCount = 0;
  elapsedSimSec = 0;
  batchIndex = 0;
  batchId = `B${Date.now().toString(36).toUpperCase()}`;
  recipe: Recipe = RECIPES.standard!;
  productionSystemId = GRACO_PD2K_3K.id;
  random = rng(Date.now());
  actual = emptyDoses();
  dripLossMg = emptyDoses();
  purgeApplied: Record<LiquidId, boolean> = { A: false, B: false, C: false };
  consumption = emptyLedger();
  cpkHistory: CpkHistoryPoint[] = [];
  preheat: PreheatState = createPreheatState();
  alarms: AlarmEvent[] = [];
  history: Array<{ scan: number; phase: string; actual: Record<LiquidId, number> }> = [];
  samples: Record<LiquidId, number[]> = { A: [], B: [], C: [] };
  interlocks: Interlock[] = [];
  tags: ControllerTag[] = [];

  get scanMs(): number {
    return Math.round(this.baseScanMs / this.speedFactor);
  }

  get system() {
    return PRODUCTION_SYSTEMS[this.productionSystemId] ?? GRACO_PD2K_3K;
  }

  constructor() {
    this.reset();
  }

  reset() {
    this.running = false;
    this.phaseIndex = 0;
    this.phaseTicksRemaining = 0;
    this.scanCount = 0;
    this.elapsedSimSec = 0;
    this.batchIndex = 0;
    this.batchId = `B${Date.now().toString(36).toUpperCase()}`;
    this.recipe = RECIPES.standard!;
    this.random = rng(Date.now());
    this.actual = emptyDoses();
    this.dripLossMg = emptyDoses();
    this.purgeApplied = { A: false, B: false, C: false };
    this.consumption = emptyLedger(this.system);
    this.alarms = [];
    this.history = [];
    this.samples = { A: [], B: [], C: [] };
    this.cpkHistory = [];
    this.preheat = createPreheatState();
    this.interlocks = this.buildInterlocks();
    this.tags = this.buildTags();
    this.syncConsumptionTargets();
  }

  setSpeedFactor(factor: number) {
    this.speedFactor = Math.min(4, Math.max(0.1, factor));
    this.syncTags();
  }

  syncConsumptionTargets() {
    (["A", "B", "C"] as LiquidId[]).forEach((L) => {
      this.consumption.targetGrams[L] = this.recipe.targets[L];
    });
    this.recomputeConsumption();
  }

  recomputeConsumption() {
    (["A", "B", "C"] as LiquidId[]).forEach((L) => {
      this.consumption.dispensedGrams[L] = this.actual[L];
      this.consumption.dripLossMg[L] = this.dripLossMg[L];
      const dripG = this.dripLossMg[L] / 1000;
      this.consumption.totalConsumedGrams[L] =
        this.actual[L] + dripG + this.consumption.purgeLossGrams[L];
      const usedMl = gramsToMl(this.consumption.totalConsumedGrams[L], LIQUIDS[L].density);
      this.consumption.tankRemainingMl[L] = this.system.tankCapacityMl[L] - usedMl;
    });
  }

  buildInterlocks(): Interlock[] {
    return [
      { id: "vent_ok", label: "LEV exhaust — all rooms", pass: true },
      { id: "lel", label: "RM-102 LEL < 10% LEL", pass: true },
      { id: "containment", label: "Secondary containment sump armed", pass: true },
      { id: "esd", label: "PD2K ESD circuit healthy", pass: true },
      { id: "hazard_profile", label: "Hazard profile complete", pass: this.recipe.hazardProfileComplete },
      { id: "preheat_a", label: "RM-101 preheat TT-101A at setpoint", pass: this.preheat.atSetpoint.A },
      { id: "preheat_c", label: "RM-103 trace heat TT-103C at setpoint", pass: this.preheat.atSetpoint.C },
      { id: "door", label: "Partition door interlocks closed", pass: true },
    ];
  }

  buildTags(): ControllerTag[] {
    const sys = this.system;
    return [
      { name: "Line.Running", value: false, type: "BOOL" },
      { name: "Line.Phase", value: "idle", type: "STRING" },
      { name: "Line.ScanCycle", value: this.scanMs, type: "REAL" },
      { name: "Line.SpeedFactor", value: this.speedFactor, type: "REAL" },
      { name: "Line.ElapsedTime", value: 0, type: "REAL" },
      { name: "PD2K.RatioAccuracy", value: sys.ratioAccuracyPct, type: "REAL" },
      { name: "Dose.A.Target", value: this.recipe.targets.A, type: "REAL" },
      { name: "Dose.A.Actual", value: 0, type: "REAL" },
      { name: "Dose.A.Flow", value: stationFlowMlMin(sys, "A"), type: "REAL" },
      { name: "Dose.B.Target", value: this.recipe.targets.B, type: "REAL" },
      { name: "Dose.B.Actual", value: 0, type: "REAL" },
      { name: "Dose.B.Flow", value: stationFlowMlMin(sys, "B"), type: "REAL" },
      { name: "Dose.C.Target", value: this.recipe.targets.C, type: "REAL" },
      { name: "Dose.C.Actual", value: 0, type: "REAL" },
      { name: "Dose.C.Flow", value: stationFlowMlMin(sys, "C"), type: "REAL" },
      { name: "QA.Cpk.A", value: 0, type: "REAL" },
      { name: "QA.Cpk.B", value: 0, type: "REAL" },
      { name: "QA.Cpk.C", value: 0, type: "REAL" },
      { name: "Tank.A.Remaining", value: this.consumption.tankRemainingMl.A, type: "REAL" },
      { name: "Tank.B.Remaining", value: this.consumption.tankRemainingMl.B, type: "REAL" },
      { name: "Tank.C.Remaining", value: this.consumption.tankRemainingMl.C, type: "REAL" },
      { name: "Preheat.A.Temp", value: this.preheat.tempC.A, type: "REAL" },
      { name: "Preheat.A.Setpoint", value: this.preheat.setpointC.A, type: "REAL" },
      { name: "Preheat.A.Power", value: this.preheat.powerW.A, type: "REAL" },
      { name: "Preheat.A.Energy", value: this.preheat.energyWh.A, type: "REAL" },
      { name: "Preheat.C.Temp", value: this.preheat.tempC.C, type: "REAL" },
      { name: "Preheat.C.Setpoint", value: this.preheat.setpointC.C, type: "REAL" },
      { name: "Preheat.C.Power", value: this.preheat.powerW.C, type: "REAL" },
      { name: "Preheat.C.Energy", value: this.preheat.energyWh.C, type: "REAL" },
      { name: "Safety.ESD", value: false, type: "BOOL" },
      { name: "Safety.DripLoss", value: 0, type: "REAL" },
    ];
  }

  setRecipe(id: string) {
    this.recipe = RECIPES[id] ?? RECIPES.standard!;
    this.interlocks = this.buildInterlocks();
    this.syncConsumptionTargets();
    this.syncTags();
  }

  enterPhase(phase: LinePhase) {
    const sys = this.system;
    if (phase.startsWith("dose_")) {
      const liquid = liquidFromPhase(phase);
      if (liquid && !this.purgeApplied[liquid]) {
        const purgeMl = sys.stations[liquid].linePurgeMl;
        this.consumption.purgeLossGrams[liquid] += purgeMl * LIQUIDS[liquid].density;
        this.purgeApplied[liquid] = true;
      }
      if (liquid) {
        const flow = stationFlowMlMin(sys, liquid);
        this.phaseTicksRemaining = dosePhaseTicks(
          this.recipe.targets[liquid],
          LIQUIDS[liquid].density,
          flow,
          this.baseScanMs,
        );
        return;
      }
    }
    if (phase.startsWith("dwell") || phase === "mix") {
      this.phaseTicksRemaining = Math.ceil((sys.mixDwellSec * 1000) / this.baseScanMs);
      return;
    }
    if (phase === "carrier_detect" || phase === "tare") {
      this.phaseTicksRemaining = Math.ceil((sys.carrierIndexSec * 1000) / this.baseScanMs);
      return;
    }
    this.phaseTicksRemaining = 2;
  }

  syncTags() {
    const set = (name: string, value: boolean | number | string) => {
      const tag = this.tags.find((t) => t.name === name);
      if (tag) tag.value = value;
    };

    set("Line.Running", this.running);
    set("Line.Phase", PHASES[this.phaseIndex]!);
    set("Line.ScanCycle", this.scanMs);
    set("Line.SpeedFactor", this.speedFactor);
    set("Line.ElapsedTime", Number(this.elapsedSimSec.toFixed(1)));
    set("Dose.A.Target", this.recipe.targets.A);
    set("Dose.B.Target", this.recipe.targets.B);
    set("Dose.C.Target", this.recipe.targets.C);
    set("Dose.A.Actual", this.actual.A);
    set("Dose.B.Actual", this.actual.B);
    set("Dose.C.Actual", this.actual.C);

    (["A", "B", "C"] as LiquidId[]).forEach((L) => {
      const stats = cpk(this.samples[L], this.recipe.targets[L], this.recipe.tolerancePct);
      set(`QA.Cpk.${L}`, Number(stats.cpk.toFixed(2)));
      set(`Tank.${L}.Remaining`, Number(this.consumption.tankRemainingMl[L].toFixed(2)));
    });

    set("Preheat.A.Temp", Number(this.preheat.tempC.A.toFixed(1)));
    set("Preheat.A.Setpoint", this.preheat.setpointC.A);
    set("Preheat.A.Power", Math.round(this.preheat.powerW.A));
    set("Preheat.A.Energy", Number(this.preheat.energyWh.A.toFixed(2)));
    set("Preheat.C.Temp", Number(this.preheat.tempC.C.toFixed(1)));
    set("Preheat.C.Setpoint", this.preheat.setpointC.C);
    set("Preheat.C.Power", Math.round(this.preheat.powerW.C));
    set("Preheat.C.Energy", Number(this.preheat.energyWh.C.toFixed(2)));

    set("Safety.DripLoss", this.dripLossMg.A + this.dripLossMg.B + this.dripLossMg.C);
    this.interlocks = this.buildInterlocks();
    this.recomputeConsumption();
  }

  alarm(priority: AlarmEvent["priority"], message: string) {
    this.alarms.unshift({ time: new Date().toISOString(), priority, message });
    this.alarms = this.alarms.slice(0, 20);
  }

  recordCpkHistory() {
    (["A", "B", "C"] as LiquidId[]).forEach((L) => {
      const samples = this.samples[L];
      if (samples.length === 0) return;
      const stats = cpk(samples, this.recipe.targets[L], this.recipe.tolerancePct);
      this.cpkHistory.push({
        batchIndex: this.batchIndex,
        batchId: this.batchId,
        liquid: L,
        cpk: stats.cpk,
        cp: stats.cp,
        mean: stats.mean,
        sigma: stats.sigma,
        sampleSize: samples.length,
        target: this.recipe.targets[L],
      });
    });
    this.cpkHistory = this.cpkHistory.slice(-60);
  }

  start(): boolean {
    if (!this.recipe.hazardProfileComplete) {
      this.alarm("HIGH", "Recipe blocked: hazard profile incomplete.");
      return false;
    }
    if (this.running) return true;
    this.running = true;
    this.batchIndex += 1;
    this.phaseIndex = 1;
    this.batchId = `PD2K-${this.batchIndex.toString().padStart(4, "0")}`;
    this.actual = emptyDoses();
    this.dripLossMg = emptyDoses();
    this.purgeApplied = { A: false, B: false, C: false };
    this.samples = { A: [], B: [], C: [] };
    (["A", "B", "C"] as LiquidId[]).forEach((L) => {
      if (PREHEAT_LOOPS[L].required) this.preheat.active[L] = true;
    });
    this.enterPhase(PHASES[this.phaseIndex]!);
    this.alarm("LOW", `Batch ${this.batchId} started — ${this.recipe.name}`);
    this.syncTags();
    return true;
  }

  stop() {
    this.running = false;
    this.phaseIndex = 0;
    this.phaseTicksRemaining = 0;
    this.syncTags();
  }

  preheatTick(sync = true) {
    const tickSec = this.baseScanMs / 1000;
    (["A", "B", "C"] as LiquidId[]).forEach((L) => {
      const dosing =
        this.running &&
        (PHASES[this.phaseIndex]!.includes(`dose_${L.toLowerCase()}`) ||
          PHASES[this.phaseIndex]!.includes(`verify_${L.toLowerCase()}`));
      tickPreheat(this.preheat, L, this.running || this.preheat.active[L], dosing, tickSec);
    });
    this.interlocks = this.buildInterlocks();
    if (sync) this.syncTags();
  }

  advancePhase() {
    const next = this.phaseIndex + 1;
    if (next >= PHASES.length) {
      this.running = false;
      this.phaseIndex = 0;
      this.phaseTicksRemaining = 0;
      return;
    }
    this.phaseIndex = next;
    this.enterPhase(PHASES[this.phaseIndex]!);
  }

  tick() {
    if (!this.running) return;

    this.scanCount += 1;
    this.elapsedSimSec += this.baseScanMs / 1000;

    const phase = PHASES[this.phaseIndex]!;
    const tol = this.recipe.tolerancePct / 100;
    const sys = this.system;

    this.preheatTick(false);

    if (phase.startsWith("dose_")) {
      const liquid = liquidFromPhase(phase);
      if (liquid) {
        if (LIQUIDS[liquid].preheatRequired && !this.preheat.atSetpoint[liquid]) {
          this.alarm("MED", `Preheat ${liquid} not at setpoint — dose held`);
          return;
        }
        const target = this.recipe.targets[liquid];
        const flowMlMin = stationFlowMlMin(sys, liquid);
        const gramsPerTick = (flowMlMin / 60) * (this.baseScanMs / 1000) * LIQUIDS[liquid].density;
        const accuracy = sys.stations[liquid].doseAccuracyPct / 100;
        const noise = 1 + (this.random() - 0.5) * accuracy * 0.4;
        this.actual[liquid] = Math.min(
          target * (1 + tol * 0.25),
          this.actual[liquid] + gramsPerTick * noise,
        );
        if (this.random() < 0.015) {
          this.dripLossMg[liquid] += 0.03 + this.random() * sys.stations[liquid].antiDripSuckBackUl * 0.002;
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
          this.phaseTicksRemaining = 4;
        }
      }
    }

    if (phase === "mix" && this.random() < 0.008) {
      const lel = this.interlocks.find((i) => i.id === "lel");
      if (lel) lel.pass = false;
      this.alarm("HIGH", "LEL rising at IPA station — ventilation interlock review");
    }

    if (phase === "release") {
      this.recordCpkHistory();
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

    this.phaseTicksRemaining -= 1;
    if (this.phaseTicksRemaining <= 0) {
      this.advancePhase();
    }

    this.history.push({ scan: this.scanCount, phase, actual: { ...this.actual } });
    this.history = this.history.slice(-200);
    this.syncTags();
  }

  snapshot(): SimulationSnapshot {
    this.syncTags();
    return {
      running: this.running,
      phase: PHASES[this.phaseIndex]!,
      scanCount: this.scanCount,
      scanMs: this.scanMs,
      baseScanMs: this.baseScanMs,
      speedFactor: this.speedFactor,
      elapsedSimSec: this.elapsedSimSec,
      phaseTicksRemaining: this.phaseTicksRemaining,
      batchId: this.batchId,
      batchIndex: this.batchIndex,
      recipe: { ...this.recipe, targets: { ...this.recipe.targets } },
      actual: { ...this.actual },
      dripLossMg: { ...this.dripLossMg },
      consumption: {
        targetGrams: { ...this.consumption.targetGrams },
        dispensedGrams: { ...this.consumption.dispensedGrams },
        dripLossMg: { ...this.consumption.dripLossMg },
        purgeLossGrams: { ...this.consumption.purgeLossGrams },
        totalConsumedGrams: { ...this.consumption.totalConsumedGrams },
        tankRemainingMl: { ...this.consumption.tankRemainingMl },
      },
      cpkHistory: [...this.cpkHistory],
      preheat: {
        tempC: { ...this.preheat.tempC },
        setpointC: { ...this.preheat.setpointC },
        powerW: { ...this.preheat.powerW },
        energyWh: { ...this.preheat.energyWh },
        active: { ...this.preheat.active },
        atSetpoint: { ...this.preheat.atSetpoint },
      },
      productionSystemId: this.productionSystemId,
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
