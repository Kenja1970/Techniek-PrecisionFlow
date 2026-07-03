import type { LinePhase } from "./types";

export const PHASES: LinePhase[] = [
  "idle",
  "carrier_detect",
  "tare",
  "dose_a",
  "verify_a",
  "dwell_ab",
  "dose_b",
  "verify_b",
  "dwell_bc",
  "dose_c",
  "verify_c",
  "mix",
  "qa_hold",
  "release",
  "complete",
];

export function nextPhase(currentIndex: number): { index: number; running: boolean } {
  const next = currentIndex + 1;
  if (next >= PHASES.length) {
    return { index: 0, running: false };
  }
  return { index: next, running: true };
}

export function liquidFromPhase(phase: LinePhase): "A" | "B" | "C" | null {
  if (phase.startsWith("dose_") || phase.startsWith("verify_")) {
    return phase.split("_")[1]!.toUpperCase() as "A" | "B" | "C";
  }
  return null;
}
