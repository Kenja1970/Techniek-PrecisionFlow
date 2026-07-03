import { describe, expect, it } from "vitest";
import { PrecisionFlowEngine } from "./dosing-engine";
import { PHASES } from "./line-state-machine";

describe("PrecisionFlowEngine", () => {
  it("starts standard recipe and populates tag table", () => {
    const engine = new PrecisionFlowEngine();
    expect(engine.start()).toBe(true);
    engine.tick();
    engine.tick();
    const snap = engine.snapshot();
    expect(snap.tags.length).toBeGreaterThanOrEqual(10);
    expect(snap.recipe.hazardProfileComplete).toBe(true);
  });

  it("blocks draft recipe without hazard profile", () => {
    const engine = new PrecisionFlowEngine();
    engine.setRecipe("draft");
    expect(engine.start()).toBe(false);
    engine.stop();
  });

  it("walks through all line phases", () => {
    const engine = new PrecisionFlowEngine();
    engine.start();
    for (let i = 0; i < PHASES.length * 3; i++) {
      engine.tick();
    }
    const snap = engine.snapshot();
    expect(snap.phase).toBe("idle");
    expect(snap.running).toBe(false);
  });
});
