import type { SimulationSnapshot } from "../simulation/types";

interface Props {
  snapshot: SimulationSnapshot;
}

export function KpiRow({ snapshot }: Props) {
  const drip =
    snapshot.dripLossMg.A + snapshot.dripLossMg.B + snapshot.dripLossMg.C;

  return (
    <div className="pf-kpi-row">
      <div className="pf-kpi">
        <span>Phase</span>
        <strong>{snapshot.phase}</strong>
      </div>
      <div className="pf-kpi">
        <span>Scan cycle</span>
        <strong>{snapshot.scanMs} ms</strong>
      </div>
      <div className="pf-kpi">
        <span>Batch</span>
        <strong>{snapshot.batchId}</strong>
      </div>
      <div className="pf-kpi">
        <span>Drip loss</span>
        <strong>{drip.toFixed(2)} mg</strong>
      </div>
    </div>
  );
}
