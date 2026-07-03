import { GRACO_PD2K_3K, stationFlowMlMin } from "../data/production-system";
import type { LiquidId } from "../simulation/types";

export function ProductionSystemPanel() {
  const sys = GRACO_PD2K_3K;

  return (
    <article className="pf-card pf-system-card">
      <h2>Reference production system</h2>
      <dl className="pf-batch">
        <dt>System</dt>
        <dd>{sys.name}</dd>
        <dt>Controller</dt>
        <dd>{sys.controller}</dd>
        <dt>OEM ratio accuracy</dt>
        <dd>±{sys.ratioAccuracyPct}%</dd>
        <dt>Scan cycle</dt>
        <dd>{sys.scanCycleMs} ms</dd>
        <dt>Carrier index</dt>
        <dd>{sys.carrierIndexSec} s</dd>
        <dt>Mix dwell</dt>
        <dd>{sys.mixDwellSec} s</dd>
      </dl>

      <h3 className="pf-subheading">Dosing stations</h3>
      <table className="pf-station-table">
        <thead>
          <tr>
            <th>Liquid</th>
            <th>Material</th>
            <th>Dispenser</th>
            <th>Flow (ml/min)</th>
            <th>Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {(["A", "B", "C"] as LiquidId[]).map((L) => {
            const st = sys.stations[L];
            const flow = stationFlowMlMin(sys, L);
            return (
              <tr key={L}>
                <td>{L}</td>
                <td>
                  {L === "A" && "NaOH 10%"}
                  {L === "B" && "IPA"}
                  {L === "C" && "Glutaraldehyde 2%"}
                </td>
                <td>{st.model}</td>
                <td className="num">
                  {flow.toFixed(2)} <small>({st.flowMlMin.min}–{st.flowMlMin.max})</small>
                </td>
                <td>±{st.doseAccuracyPct}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ul className="pf-system-notes">
        {sys.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </article>
  );
}
