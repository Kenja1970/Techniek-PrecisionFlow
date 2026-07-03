import type { Liquid, LiquidId } from "../simulation/types";

export const LIQUIDS: Record<LiquidId, Liquid> = {
  A: {
    id: "A",
    name: "Liquid A",
    materialName: "NaOH 10% solution",
    density: 1.11,
    viscosity: 12,
    dropletUl: 50,
    hazard: "corrosive",
    pumpModel: "preeflow eco-PEN 600",
    preheatRequired: true,
  },
  B: {
    id: "B",
    name: "Liquid B",
    materialName: "Isopropanol (IPA)",
    density: 0.786,
    viscosity: 2.4,
    dropletUl: 48,
    hazard: "flammable",
    pumpModel: "preeflow eco-PEN 450",
    preheatRequired: false,
  },
  C: {
    id: "C",
    name: "Liquid C",
    materialName: "Glutaraldehyde 2%",
    density: 1.02,
    viscosity: 22,
    dropletUl: 52,
    hazard: "toxic",
    pumpModel: "preeflow eco-PEN XS 180",
    preheatRequired: true,
  },
};
