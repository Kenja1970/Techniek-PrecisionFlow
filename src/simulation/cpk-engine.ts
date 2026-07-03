import type { CpkStats } from "./types";

export function cpk(samples: number[], target: number, tolerancePct: number): CpkStats {
  const tolerance = tolerancePct / 100;
  const usl = target * (1 + tolerance);
  const lsl = target * (1 - tolerance);

  if (samples.length < 3) {
    return { cp: 0, cpk: 0, mean: 0, sigma: 0, lsl, usl };
  }

  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  const variance = samples.reduce((s, v) => s + (v - mean) ** 2, 0) / (samples.length - 1);
  const sigma = Math.sqrt(Math.max(variance, 1e-9));
  const cp = (usl - lsl) / (6 * sigma);
  const cpk = Math.min((usl - mean) / (3 * sigma), (mean - lsl) / (3 * sigma));

  return { cp, cpk, mean, sigma, lsl, usl };
}
