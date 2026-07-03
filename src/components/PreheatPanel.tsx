import { PREHEAT_LOOPS } from "../data/facility-layout";
import type { LiquidId, SimulationSnapshot } from "../simulation/types";

interface Props {
  snapshot: SimulationSnapshot;
}

const COLORS: Record<LiquidId, string> = { A: "#4da3ff", B: "#3ddc84", C: "#ffc857" };

function PreheatLoopCard({ liquid, snapshot }: { liquid: LiquidId; snapshot: SimulationSnapshot }) {
  const spec = PREHEAT_LOOPS[liquid];
  const info = snapshot.liquids[liquid];
  const ph = snapshot.preheat;

  if (!spec.required) {
    return (
      <div className="pf-preheat-card pf-preheat-na">
        <h4 style={{ color: COLORS[liquid] }}>Liquid {liquid} — {info.materialName}</h4>
        <p>{spec.heaterType}</p>
        <p className="pf-preheat-status">No preheat required</p>
      </div>
    );
  }

  const heating = ph.active[liquid] && !ph.atSetpoint[liquid];
  const ready = ph.atSetpoint[liquid];

  return (
    <div className={`pf-preheat-card ${heating ? "heating" : ready ? "ready" : "idle"}`}>
      <h4 style={{ color: COLORS[liquid] }}>Liquid {liquid} — {info.materialName}</h4>
      <p className="pf-preheat-type">{spec.heaterType}</p>
      <p className="pf-preheat-visc">{info.viscosity} cP — trace heat required</p>

      <div className="pf-preheat-gauges">
        <div>
          <span className="pf-preheat-label">Temperature</span>
          <span className="pf-preheat-reading">
            {ph.tempC[liquid].toFixed(1)} <span className="pf-inline-unit">°C</span>
          </span>
        </div>
        <div>
          <span className="pf-preheat-label">Setpoint</span>
          <span className="pf-preheat-reading">
            {ph.setpointC[liquid].toFixed(1)} <span className="pf-inline-unit">°C</span>
          </span>
        </div>
        <div>
          <span className="pf-preheat-label">Power</span>
          <span className="pf-preheat-reading">
            {Math.round(ph.powerW[liquid])} <span className="pf-inline-unit">W</span>
          </span>
        </div>
        <div>
          <span className="pf-preheat-label">Energy consumed</span>
          <span className="pf-preheat-reading pf-energy">
            {ph.energyWh[liquid].toFixed(2)} <span className="pf-inline-unit">Wh</span>
          </span>
        </div>
      </div>

      <div className="pf-preheat-bar-wrap">
        <div
          className="pf-preheat-bar"
          style={{
            width: `${Math.min(100, (ph.tempC[liquid] / ph.setpointC[liquid]) * 100)}%`,
            background: COLORS[liquid],
          }}
        />
      </div>
      <p className="pf-preheat-status">
        {heating ? "Heating…" : ready ? "At setpoint — dose enabled" : "Standby"}
        {" · "}
        RTD {spec.rtdTag} · loop volume {spec.volumeMl} ml
      </p>
    </div>
  );
}

export function PreheatPanel({ snapshot }: Props) {
  const totalWh =
    snapshot.preheat.energyWh.A +
    snapshot.preheat.energyWh.B +
    snapshot.preheat.energyWh.C;

  return (
    <article className="pf-card">
      <h2>Preheat &amp; trace heating</h2>
      <p className="pf-system-ref">
        Jacketed circulation (A) and silicone trace (C) — energy logged in{" "}
        <span className="pf-inline-unit">Wh</span>
      </p>
      <div className="pf-preheat-grid">
        {(["A", "B", "C"] as LiquidId[]).map((L) => (
          <PreheatLoopCard key={L} liquid={L} snapshot={snapshot} />
        ))}
      </div>
      <div className="pf-preheat-total">
        Total preheat energy this session:{" "}
        <strong>
          {totalWh.toFixed(2)} <span className="pf-inline-unit">Wh</span>
        </strong>
        {" "}
        ({(totalWh / 1000).toFixed(3)} <span className="pf-inline-unit">kWh</span>)
      </div>
    </article>
  );
}
