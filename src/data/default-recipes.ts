import type { Recipe } from "../simulation/types";

export const RECIPES: Record<string, Recipe> = {
  standard: {
    id: "standard",
    name: "Standard 3-liquid batch",
    targets: { A: 12.5, B: 8.2, C: 4.1 },
    tolerancePct: 0.1,
    cpkTarget: 1.67,
    hazardProfileComplete: true,
  },
  highVis: {
    id: "highVis",
    name: "High-viscosity variant",
    targets: { A: 10.0, B: 9.5, C: 5.0 },
    tolerancePct: 0.15,
    cpkTarget: 1.67,
    hazardProfileComplete: true,
  },
  draft: {
    id: "draft",
    name: "Draft recipe (blocked)",
    targets: { A: 11, B: 7, C: 3 },
    tolerancePct: 0.1,
    cpkTarget: 1.67,
    hazardProfileComplete: false,
  },
};
