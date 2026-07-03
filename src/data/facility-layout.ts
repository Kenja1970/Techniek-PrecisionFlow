import type { LiquidId } from "../simulation/types";

export interface PartitionRoom {
  id: string;
  label: string;
  hazardClass: string;
  partitionType: string;
  widthM: number;
  depthM: number;
  liquid?: LiquidId;
}

export interface PipeRun {
  id: string;
  liquid: LiquidId;
  from: string;
  to: string;
  lengthM: number;
  sizeLabel: string;
  material: string;
  roomId: string;
  notes?: string;
}

export interface PreheatLoopSpec {
  liquid: LiquidId;
  required: boolean;
  setpointC: number;
  ratedPowerW: number;
  holdPowerW: number;
  heaterType: string;
  rtdTag: string;
  volumeMl: number;
}

/**
 * Typical modular hazardous-dosing suite layout:
 * - Separate partitionable rooms per hazard class (NFPA / OSHA segregation practice)
 * - SS316 transfer piping with length kept minimal inside each enclosure
 * - Longer solvent run in dedicated flammable room with LEL monitoring
 */
export const FACILITY_ROOMS: PartitionRoom[] = [
  {
    id: "rm-101",
    label: "RM-101 Corrosive bulk & dose",
    hazardClass: "Corrosive (Class B)",
    partitionType: "Acid-resistant FRP panel + epoxy floor",
    widthM: 4.5,
    depthM: 5.0,
    liquid: "A",
  },
  {
    id: "rm-102",
    label: "RM-102 Flammable solvent",
    hazardClass: "Flammable (Class I, Div 2)",
    partitionType: "2-hr fire-rated wall, explosion-proof HVAC",
    widthM: 5.0,
    depthM: 6.0,
    liquid: "B",
  },
  {
    id: "rm-103",
    label: "RM-103 Toxic micro-dose",
    hazardClass: "Toxic / sensitizer",
    partitionType: "Negative-pressure glovebox annex",
    widthM: 3.5,
    depthM: 4.0,
    liquid: "C",
  },
  {
    id: "rm-104",
    label: "RM-104 Mix & QA release",
    hazardClass: "Controlled non-classified (neg. pressure)",
    partitionType: "Washdown partition to corridor",
    widthM: 6.0,
    depthM: 5.5,
  },
];

export const PIPE_RUNS: PipeRun[] = [
  {
    id: "pipe-a-bulk",
    liquid: "A",
    from: "TK-101A bulk",
    to: "HX-101 jacket outlet",
    lengthM: 2.4,
    sizeLabel: '3/8" OD',
    material: "SS316L seamless",
    roomId: "rm-101",
    notes: "Corrosive service, slope 1:100 to drain",
  },
  {
    id: "pipe-a-preheat",
    liquid: "A",
    from: "HX-101 outlet",
    to: "P-101A eco-PEN 600",
    lengthM: 1.8,
    sizeLabel: '1/4" OD',
    material: "SS316L electropolished",
    roomId: "rm-101",
    notes: "Jacketed trace, 32 °C setpoint",
  },
  {
    id: "pipe-a-transfer",
    liquid: "A",
    from: "P-101A discharge",
    to: "MV-104 mixer nozzle A",
    lengthM: 8.5,
    sizeLabel: '1/4" OD',
    material: "SS316L",
    roomId: "rm-101",
    notes: "Through airlock AL-1 to mix room, 4.2 m in corridor sleeve",
  },
  {
    id: "pipe-b-bulk",
    liquid: "B",
    from: "TK-102B bulk",
    to: "P-102B eco-PEN 450",
    lengthM: 3.2,
    sizeLabel: '3/8" OD',
    material: "SS316L",
    roomId: "rm-102",
    notes: "Bonded grounding strap each 3 m",
  },
  {
    id: "pipe-b-transfer",
    liquid: "B",
    from: "P-102B discharge",
    to: "MV-104 mixer nozzle B",
    lengthM: 12.0,
    sizeLabel: '3/8" OD',
    material: "SS316L",
    roomId: "rm-102",
    notes: "Long run for separation from ignition sources; LEL probe at 6 m",
  },
  {
    id: "pipe-c-bulk",
    liquid: "C",
    from: "TK-103C day tank",
    to: "HX-103 trace block",
    lengthM: 1.2,
    sizeLabel: '1/8" OD',
    material: "PTFE-lined SS",
    roomId: "rm-103",
    notes: "Inside glovebox; double containment pan",
  },
  {
    id: "pipe-c-preheat",
    liquid: "C",
    from: "HX-103 outlet",
    to: "P-103C eco-PEN XS",
    lengthM: 0.9,
    sizeLabel: '1/8" OD',
    material: "PTFE-lined SS",
    roomId: "rm-103",
    notes: "38 °C trace heat — viscosity 22 cP at ambient",
  },
  {
    id: "pipe-c-transfer",
    liquid: "C",
    from: "P-103C discharge",
    to: "MV-104 mixer nozzle C",
    lengthM: 6.0,
    sizeLabel: '1/8" OD',
    material: "PTFE-lined SS",
    roomId: "rm-103",
    notes: "Through HEPA airlock AL-2",
  },
];

export const PREHEAT_LOOPS: Record<LiquidId, PreheatLoopSpec> = {
  A: {
    liquid: "A",
    required: true,
    setpointC: 32,
    ratedPowerW: 250,
    holdPowerW: 75,
    heaterType: "Jacketed circulation — 0.5 kW HX + 250 W trim",
    rtdTag: "TT-101A",
    volumeMl: 420,
  },
  B: {
    liquid: "B",
    required: false,
    setpointC: 22,
    ratedPowerW: 0,
    holdPowerW: 0,
    heaterType: "Not required — IPA 2.4 cP at ambient",
    rtdTag: "TT-102B",
    volumeMl: 0,
  },
  C: {
    liquid: "C",
    required: true,
    setpointC: 38,
    ratedPowerW: 400,
    holdPowerW: 120,
    heaterType: "Silicone trace + PID — glutaraldehyde 22 cP",
    rtdTag: "TT-103C",
    volumeMl: 85,
  },
};

export function totalPipeLengthM(liquid: LiquidId): number {
  return PIPE_RUNS.filter((p) => p.liquid === liquid).reduce((s, p) => s + p.lengthM, 0);
}
