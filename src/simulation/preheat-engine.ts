import { PREHEAT_LOOPS } from "../data/facility-layout";
import type { LiquidId, PreheatState } from "../simulation/types";

const AMBIENT_C = 20;

export function createPreheatState(): PreheatState {
  const tempC = { A: AMBIENT_C, B: AMBIENT_C, C: AMBIENT_C };
  const setpointC = {
    A: PREHEAT_LOOPS.A.setpointC,
    B: PREHEAT_LOOPS.B.setpointC,
    C: PREHEAT_LOOPS.C.setpointC,
  };
  const powerW = { A: 0, B: 0, C: 0 };
  const energyWh = { A: 0, B: 0, C: 0 };
  const active = { A: false, B: false, C: false };
  const atSetpoint = { A: false, B: false, C: true };
  return { tempC, setpointC, powerW, energyWh, active, atSetpoint };
}

export function tickPreheat(
  state: PreheatState,
  liquid: LiquidId,
  lineRunning: boolean,
  dosingThisLiquid: boolean,
  tickSec: number,
): void {
  const spec = PREHEAT_LOOPS[liquid];
  if (!spec.required) {
    state.active[liquid] = false;
    state.powerW[liquid] = 0;
    state.atSetpoint[liquid] = true;
    state.tempC[liquid] = AMBIENT_C;
    return;
  }

  state.active[liquid] = lineRunning || dosingThisLiquid;
  const setpoint = spec.setpointC;
  const temp = state.tempC[liquid];

  if (!state.active[liquid]) {
    state.tempC[liquid] = Math.max(AMBIENT_C, temp - tickSec * 0.08);
    state.powerW[liquid] = 0;
    state.atSetpoint[liquid] = state.tempC[liquid] >= setpoint - 0.5;
    return;
  }

  if (temp < setpoint - 0.3) {
    state.powerW[liquid] = spec.ratedPowerW;
    state.tempC[liquid] = Math.min(setpoint, temp + tickSec * (spec.ratedPowerW / 800));
    state.atSetpoint[liquid] = false;
  } else {
    state.powerW[liquid] = spec.holdPowerW;
    state.tempC[liquid] = setpoint + (Math.random() - 0.5) * 0.2;
    state.atSetpoint[liquid] = true;
  }

  state.energyWh[liquid] += (state.powerW[liquid] * tickSec) / 3600;
}
