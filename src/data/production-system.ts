import type { LiquidId } from "../simulation/types";

/**
 * Reference: Graco ProMix PD2K 3K electronic proportioner with three positive-
 * displacement pump stations (Graco PD platform, ±1% ratio accuracy, 5–800 cc/min
 * 3K mix flow, 20–5000 cP viscosity range).
 *
 * Station dispensers modeled as ViscoTec preeflow eco-PEN volumetric micro-dispensers
 * (±1% dose accuracy, >99% repeatability, suck-back anti-drip).
 *
 * Sources:
 * - Graco 345107EN ProMix PD platform datasheet
 * - Graco 332564EN-L PD2K automatic spray manual (flow registers, 5–1600 cc/min 2K)
 * - ViscoTec preeflow eco-PEN XS / 300 / 600 datasheets
 */
export interface PumpStationSpec {
  model: string;
  flowMlMin: { min: number; max: number };
  doseAccuracyPct: number;
  repeatabilityPct: number;
  minDoseMl: number;
  antiDripSuckBackUl: number;
  linePurgeMl: number;
  maxPressureBar: number;
}

export interface ProductionSystemProfile {
  id: string;
  name: string;
  manufacturer: string;
  controller: string;
  ratioAccuracyPct: number;
  scanCycleMs: number;
  carrierIndexSec: number;
  mixDwellSec: number;
  tankCapacityMl: Record<LiquidId, number>;
  stations: Record<LiquidId, PumpStationSpec>;
  notes: string[];
}

export const GRACO_PD2K_3K: ProductionSystemProfile = {
  id: "graco-pd2k-3k",
  name: "Graco ProMix PD2K — 3K hazardous dosing line",
  manufacturer: "Graco Inc. (proportioner) + ViscoTec/preeflow (station dispensers)",
  controller: "PD2K PLC/HMI — 50 ms scan, per-pump flow registers (cc/min)",
  ratioAccuracyPct: 1.0,
  scanCycleMs: 50,
  carrierIndexSec: 15,
  mixDwellSec: 6.0,
  tankCapacityMl: { A: 5000, B: 3000, C: 2000 },
  stations: {
    A: {
      model: "preeflow eco-PEN 600",
      flowMlMin: { min: 1.4, max: 16.0 },
      doseAccuracyPct: 1.0,
      repeatabilityPct: 99.0,
      minDoseMl: 0.015,
      antiDripSuckBackUl: 50,
      linePurgeMl: 0.35,
      maxPressureBar: 10,
    },
    B: {
      model: "preeflow eco-PEN 450",
      flowMlMin: { min: 0.5, max: 6.0 },
      doseAccuracyPct: 1.0,
      repeatabilityPct: 99.0,
      minDoseMl: 0.004,
      antiDripSuckBackUl: 48,
      linePurgeMl: 0.28,
      maxPressureBar: 20,
    },
    C: {
      model: "preeflow eco-PEN XS 180",
      flowMlMin: { min: 0.0044, max: 0.35 },
      doseAccuracyPct: 1.0,
      repeatabilityPct: 99.0,
      minDoseMl: 0.00025,
      antiDripSuckBackUl: 52,
      linePurgeMl: 0.12,
      maxPressureBar: 20,
    },
  },
  notes: [
    "ProMix PD2K maintains mix ratio within ±1% via encoder piston PD pumps (Graco).",
    "Recipe QA target ±0.1% is tighter than OEM ratio spec — modeled as site validation limit.",
    "Station flow rates set to 70% of max for corrosive/flammable/toxic service derating.",
    "Line purge volumes per station start reflect typical dead-volume flush (simulation).",
  ],
};

export const PRODUCTION_SYSTEMS: Record<string, ProductionSystemProfile> = {
  [GRACO_PD2K_3K.id]: GRACO_PD2K_3K,
};

/** Operating flow (ml/min) per liquid — 70% of pump max, clamped to min. */
export function stationFlowMlMin(system: ProductionSystemProfile, liquid: LiquidId): number {
  const spec = system.stations[liquid];
  const derated = spec.flowMlMin.max * 0.7;
  return Math.max(spec.flowMlMin.min, derated);
}

export function gramsToMl(grams: number, density: number): number {
  return grams / density;
}

export function dosePhaseTicks(
  targetGrams: number,
  density: number,
  flowMlMin: number,
  scanMs: number,
): number {
  const volumeMl = gramsToMl(targetGrams, density);
  const doseSec = (volumeMl / flowMlMin) * 60;
  return Math.max(4, Math.ceil((doseSec * 1000) / scanMs));
}
