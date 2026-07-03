import type { ControllerTag } from "../simulation/types";

export interface TagMeta {
  unit: string;
  group: string;
  decimals?: number;
}

/** SCADA tag names without embedded units — units render to the right of value. */
export const TAG_META: Record<string, TagMeta> = {
  "Line.Running": { unit: "", group: "Line" },
  "Line.Phase": { unit: "", group: "Line" },
  "Line.ScanCycle": { unit: "ms", group: "Line", decimals: 0 },
  "Line.SpeedFactor": { unit: "×", group: "Line", decimals: 2 },
  "Line.ElapsedTime": { unit: "s", group: "Line", decimals: 1 },
  "PD2K.RatioAccuracy": { unit: "%", group: "Controller", decimals: 1 },
  "Dose.A.Target": { unit: "g", group: "Dose A", decimals: 3 },
  "Dose.A.Actual": { unit: "g", group: "Dose A", decimals: 3 },
  "Dose.A.Flow": { unit: "ml/min", group: "Dose A", decimals: 2 },
  "Dose.B.Target": { unit: "g", group: "Dose B", decimals: 3 },
  "Dose.B.Actual": { unit: "g", group: "Dose B", decimals: 3 },
  "Dose.B.Flow": { unit: "ml/min", group: "Dose B", decimals: 2 },
  "Dose.C.Target": { unit: "g", group: "Dose C", decimals: 3 },
  "Dose.C.Actual": { unit: "g", group: "Dose C", decimals: 3 },
  "Dose.C.Flow": { unit: "ml/min", group: "Dose C", decimals: 2 },
  "QA.Cpk.A": { unit: "", group: "Quality", decimals: 2 },
  "QA.Cpk.B": { unit: "", group: "Quality", decimals: 2 },
  "QA.Cpk.C": { unit: "", group: "Quality", decimals: 2 },
  "Tank.A.Remaining": { unit: "ml", group: "Inventory", decimals: 1 },
  "Tank.B.Remaining": { unit: "ml", group: "Inventory", decimals: 1 },
  "Tank.C.Remaining": { unit: "ml", group: "Inventory", decimals: 1 },
  "Preheat.A.Temp": { unit: "°C", group: "Preheat", decimals: 1 },
  "Preheat.A.Setpoint": { unit: "°C", group: "Preheat", decimals: 1 },
  "Preheat.A.Power": { unit: "W", group: "Preheat", decimals: 0 },
  "Preheat.A.Energy": { unit: "Wh", group: "Preheat", decimals: 2 },
  "Preheat.C.Temp": { unit: "°C", group: "Preheat", decimals: 1 },
  "Preheat.C.Setpoint": { unit: "°C", group: "Preheat", decimals: 1 },
  "Preheat.C.Power": { unit: "W", group: "Preheat", decimals: 0 },
  "Preheat.C.Energy": { unit: "Wh", group: "Preheat", decimals: 2 },
  "Safety.ESD": { unit: "", group: "Safety" },
  "Safety.DripLoss": { unit: "mg", group: "Safety", decimals: 2 },
};

export function formatTagValue(tag: ControllerTag): string {
  const meta = TAG_META[tag.name];
  if (tag.type === "BOOL") return tag.value ? "TRUE" : "FALSE";
  if (tag.type === "STRING") return String(tag.value);
  const decimals = meta?.decimals ?? 2;
  return Number(tag.value).toFixed(decimals);
}

export function tagUnit(name: string): string {
  return TAG_META[name]?.unit ?? "";
}

export function tagGroup(name: string): string {
  return TAG_META[name]?.group ?? "Other";
}
