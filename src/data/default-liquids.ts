import type { Liquid, LiquidId } from "../simulation/types";

export const LIQUIDS: Record<LiquidId, Liquid> = {
  A: { id: "A", name: "Liquid A", density: 1.02, viscosity: 12, dropletUl: 50, hazard: "corrosive" },
  B: { id: "B", name: "Liquid B", density: 0.98, viscosity: 8, dropletUl: 48, hazard: "flammable" },
  C: { id: "C", name: "Liquid C", density: 1.08, viscosity: 22, dropletUl: 52, hazard: "toxic" },
};
