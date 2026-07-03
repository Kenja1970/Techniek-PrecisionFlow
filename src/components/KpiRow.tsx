import type { SimulationSnapshot } from "../simulation/types";

interface Props {
  snapshot: SimulationSnapshot;
}

export function KpiRow({ snapshot }: Props) {
  const drip =
    snapshot.dripLossMg.A + snapshot.dripLossMg.B + snapshot.dripLossMg.C;
  const mins = Math.floor(snapshot.elapsedSimSec / 60);
  const secs = Math.floor(snapshot.elapsedSimSec % 60);

  return (
    <div className="pf-kpi-row">
      <div className="pf-kpi">
        <span>Phase</span>
        <strong>{snapshot.phase}</strong>
      </div>
      <div className="pf-kpi">
        <span>Sim time</span>
        <strong>
          {mins}:{secs.toString().padStart(2, "0")}
        </strong>
      </div>
      <div className="pf-kpi">
        <span>Batch</span>
        <strong>{snapshot.batchId}</strong>
      </div>
      <div className="pf-kpi">
        <span>Speed</span>
        <strong>{snapshot.speedFactor.toFixed(2)}×</strong>
      </div>
      <div className="pf-kpi">
        <span>Drip loss</span>
        <strong>{drip.toFixed(2)} mg</strong>
      </div>
    </div>
  );
}
