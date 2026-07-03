export type LiquidId = "A" | "B" | "C";

export interface Liquid {
  id: LiquidId;
  name: string;
  density: number;
  viscosity: number;
  dropletUl: number;
  hazard: string;
}

export interface Recipe {
  id: string;
  name: string;
  targets: Record<LiquidId, number>;
  tolerancePct: number;
  cpkTarget: number;
  hazardProfileComplete: boolean;
}

export interface ControllerTag {
  name: string;
  value: boolean | number | string;
  type: "BOOL" | "REAL" | "STRING";
}

export interface AlarmEvent {
  time: string;
  priority: "LOW" | "MED" | "HIGH";
  message: string;
}

export interface Interlock {
  id: string;
  label: string;
  pass: boolean;
}

export interface CpkStats {
  cp: number;
  cpk: number;
  mean: number;
  sigma: number;
  lsl: number;
  usl: number;
}

export interface SimulationSnapshot {
  running: boolean;
  phase: LinePhase;
  scanCount: number;
  scanMs: number;
  batchId: string;
  recipe: Recipe;
  actual: Record<LiquidId, number>;
  dripLossMg: Record<LiquidId, number>;
  tags: ControllerTag[];
  alarms: AlarmEvent[];
  interlocks: Interlock[];
  samples: Record<LiquidId, number[]>;
  liquids: Record<LiquidId, Liquid>;
  recipes: Record<string, Recipe>;
}

export type LinePhase =
  | "idle"
  | "carrier_detect"
  | "tare"
  | "dose_a"
  | "verify_a"
  | "dwell_ab"
  | "dose_b"
  | "verify_b"
  | "dwell_bc"
  | "dose_c"
  | "verify_c"
  | "mix"
  | "qa_hold"
  | "release"
  | "complete";
