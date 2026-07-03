import { describe, expect, it } from "vitest";
import { dosePhaseTicks, stationFlowMlMin, GRACO_PD2K_3K } from "../data/production-system";
import { PrecisionFlowEngine } from "./dosing-engine";

describe("PrecisionFlowEngine", () => {
  it("starts standard recipe and populates tag table", () => {
    const engine = new PrecisionFlowEngine();
    expect(engine.start()).toBe(true);
    engine.tick();
    engine.tick();
    const snap = engine.snapshot();
    expect(snap.tags.length).toBeGreaterThanOrEqual(15);
    expect(snap.recipe.hazardProfileComplete).toBe(true);
    expect(snap.productionSystemId).toBe("graco-pd2k-3k");
  });

  it("blocks draft recipe without hazard profile", () => {
    const engine = new PrecisionFlowEngine();
    engine.setRecipe("draft");
    expect(engine.start()).toBe(false);
    engine.stop();
  });

  it("slows simulation when speed factor is reduced", () => {
    const engine = new PrecisionFlowEngine();
    engine.setSpeedFactor(0.25);
    expect(engine.scanMs).toBe(200);
    engine.setSpeedFactor(2);
    expect(engine.scanMs).toBe(25);
  });

  it("tracks consumption and tank levels", () => {
    const engine = new PrecisionFlowEngine();
    engine.preheat.active.A = true;
    engine.preheat.active.C = true;
    for (let i = 0; i < 3000; i++) engine.preheatTick();
    engine.start();
    for (let i = 0; i < 2000; i++) engine.tick();
    const snap = engine.snapshot();
    expect(snap.consumption.targetGrams.A).toBe(12.5);
    const totalUsedMl =
      GRACO_PD2K_3K.tankCapacityMl.A - snap.consumption.tankRemainingMl.A;
    expect(totalUsedMl).toBeGreaterThan(0);
  });

  it("completes a batch after sufficient ticks", () => {
    const engine = new PrecisionFlowEngine();
    engine.setSpeedFactor(4);
    engine.start();
    for (let i = 0; i < 8000; i++) {
      engine.tick();
      if (!engine.running) break;
    }
    const snap = engine.snapshot();
    expect(snap.batchIndex).toBeGreaterThanOrEqual(1);
    expect(snap.elapsedSimSec).toBeGreaterThan(0);
  });
});

describe("production system parameters", () => {
  it("computes realistic dose phase duration from pump flow", () => {
    const ticks = dosePhaseTicks(12.5, 1.11, stationFlowMlMin(GRACO_PD2K_3K, "A"), 50);
    expect(ticks).toBeGreaterThan(50);
  });
});
