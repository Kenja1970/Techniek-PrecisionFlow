import type { Recipe } from "../simulation/types";

/**
 * Graco PD2K 3K recipe — mass ratio A:B:C ≈ 12.5:8.2:4.1 (1.53:1:0.50)
 * within PD2K 3K ratio range 0.1:1 to 100:1, ±1% OEM accuracy.
 */
export const RECIPES: Record<string, Recipe> = {
  standard: {
    id: "standard",
    name: "PD2K-3K Standard hazardous batch",
    targets: { A: 12.5, B: 8.2, C: 4.1 },
    tolerancePct: 0.1,
    cpkTarget: 1.67,
    hazardProfileComplete: true,
  },
  highVis: {
    id: "highVis",
    name: "PD2K-3K High-viscosity variant",
    targets: { A: 10.0, B: 9.5, C: 5.0 },
    tolerancePct: 0.15,
    cpkTarget: 1.67,
    hazardProfileComplete: true,
  },
  draft: {
    id: "draft",
    name: "Draft recipe (blocked — hazard profile incomplete)",
    targets: { A: 11, B: 7, C: 3 },
    tolerancePct: 0.1,
    cpkTarget: 1.67,
    hazardProfileComplete: false,
  },
};
