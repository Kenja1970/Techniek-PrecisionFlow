import { describe, expect, it } from "vitest";
import { cpk } from "./cpk-engine";

describe("cpk engine", () => {
  it("returns zero stats when sample size is too small", () => {
    const stats = cpk([12.5], 12.5, 0.1);
    expect(stats.cpk).toBe(0);
    expect(stats.lsl).toBeCloseTo(12.4875);
    expect(stats.usl).toBeCloseTo(12.5125);
  });

  it("computes centered capable process above target Cpk", () => {
    const samples = Array.from({ length: 30 }, () => 12.5 + (Math.random() - 0.5) * 0.002);
    const stats = cpk(samples, 12.5, 0.1);
    expect(stats.cpk).toBeGreaterThan(1);
    expect(stats.mean).toBeCloseTo(12.5, 1);
  });
});
