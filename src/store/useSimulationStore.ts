import { create } from "zustand";
import { PrecisionFlowEngine } from "../simulation/dosing-engine";
import type { SimulationSnapshot } from "../simulation/types";

interface SimulationState {
  engine: PrecisionFlowEngine;
  snapshot: SimulationSnapshot;
  timerId: ReturnType<typeof setInterval> | null;
  setRecipe: (id: string) => void;
  setSpeed: (factor: number) => void;
  start: () => void;
  stop: () => void;
  reset: () => void;
  tick: () => void;
  exportBatch: () => void;
  preheatLine: () => void;
}

function refresh(engine: PrecisionFlowEngine): SimulationSnapshot {
  return engine.snapshot();
}

function restartTimer(get: () => SimulationState, set: (partial: Partial<SimulationState>) => void) {
  const { engine, timerId } = get();
  if (timerId) clearInterval(timerId);
  if (!engine.running) {
    set({ timerId: null });
    return;
  }
  const id = setInterval(() => get().tick(), engine.scanMs);
  set({ timerId: id });
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  engine: new PrecisionFlowEngine(),
  snapshot: new PrecisionFlowEngine().snapshot(),
  timerId: null,

  setRecipe: (id) => {
    const { engine, timerId } = get();
    engine.setRecipe(id);
    if (timerId) clearInterval(timerId);
    set({ snapshot: refresh(engine), timerId: null });
  },

  setSpeed: (factor) => {
    const { engine } = get();
    engine.setSpeedFactor(factor);
    set({ snapshot: refresh(engine) });
    restartTimer(get, set);
  },

  start: () => {
    const { engine } = get();
    if (!engine.start()) {
      set({ snapshot: refresh(engine) });
      return;
    }
    restartTimer(get, set);
    set({ snapshot: refresh(engine) });
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
    set({ snapshot: refresh(engine), timerId: null });
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

  preheatLine: () => {
    const { engine, timerId } = get();
    if (engine.running) return;
    engine.preheat.active.A = true;
    engine.preheat.active.C = true;
    if (timerId) clearInterval(timerId);
    const id = setInterval(() => {
      const state = get();
      if (state.engine.running) return;
      state.engine.preheatTick();
      set({ snapshot: refresh(state.engine) });
      if (state.engine.preheat.atSetpoint.A && state.engine.preheat.atSetpoint.C) {
        const tid = get().timerId;
        if (tid) clearInterval(tid);
        set({ timerId: null });
      }
    }, engine.scanMs);
    set({ timerId: id, snapshot: refresh(engine) });
  },
}));
