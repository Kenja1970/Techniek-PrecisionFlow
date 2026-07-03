import { create } from "zustand";
import { PrecisionFlowEngine } from "../simulation/dosing-engine";
import type { SimulationSnapshot } from "../simulation/types";

interface SimulationState {
  engine: PrecisionFlowEngine;
  snapshot: SimulationSnapshot;
  timerId: ReturnType<typeof setInterval> | null;
  setRecipe: (id: string) => void;
  start: () => void;
  stop: () => void;
  reset: () => void;
  tick: () => void;
  exportBatch: () => void;
}

function refresh(engine: PrecisionFlowEngine): SimulationSnapshot {
  return engine.snapshot();
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  engine: new PrecisionFlowEngine(),
  snapshot: new PrecisionFlowEngine().snapshot(),
  timerId: null,

  setRecipe: (id) => {
    const { engine, timerId } = get();
    engine.setRecipe(id);
    set({ snapshot: refresh(engine) });
    if (timerId) clearInterval(timerId);
    set({ timerId: null });
  },

  start: () => {
    const { engine, timerId } = get();
    if (!engine.start()) {
      set({ snapshot: refresh(engine) });
      return;
    }
    if (timerId) clearInterval(timerId);
    const id = setInterval(() => get().tick(), engine.scanMs);
    set({ snapshot: refresh(engine), timerId: id });
  },

  stop: () => {
    const { engine, timerId } = get();
    engine.stop();
    if (timerId) clearInterval(timerId);
    set({ snapshot: refresh(engine), timerId: null });
  },

  reset: () => {
    const { engine, timerId } = get();
    engine.reset();
    if (timerId) clearInterval(timerId);
    set({ engine, snapshot: refresh(engine), timerId: null });
  },

  tick: () => {
    const { engine } = get();
    engine.tick();
    set({ snapshot: refresh(engine) });
  },

  exportBatch: () => {
    const { engine } = get();
    const blob = new Blob([JSON.stringify(engine.snapshot(), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${engine.batchId}-batch-record.json`;
    a.click();
    URL.revokeObjectURL(url);
  },
}));
