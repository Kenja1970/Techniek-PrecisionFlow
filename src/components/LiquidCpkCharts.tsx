import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cpk } from "../simulation/cpk-engine";
import { GRACO_PD2K_3K } from "../data/production-system";
import type { LiquidId, SimulationSnapshot } from "../simulation/types";

interface Props {
  snapshot: SimulationSnapshot;
}

const COLORS: Record<LiquidId, string> = { A: "#4da3ff", B: "#3ddc84", C: "#ffc857" };

function LiquidCpkPanel({
  liquid,
  snapshot,
}: {
  liquid: LiquidId;
  snapshot: SimulationSnapshot;
}) {
  const info = snapshot.liquids[liquid];
  const target = snapshot.recipe.targets[liquid];
  const stats = cpk(snapshot.samples[liquid], target, snapshot.recipe.tolerancePct);
  const history = snapshot.cpkHistory.filter((h) => h.liquid === liquid);

  const doseData = snapshot.samples[liquid].map((v, i) => ({
    index: i + 1,
    dose: v,
  }));

  const cpkData = history.map((h) => ({
    batch: h.batchId.replace("PD2K-", "#"),
    cpk: Number(h.cpk.toFixed(2)),
  }));

  const capable = stats.cpk >= snapshot.recipe.cpkTarget;

  return (
    <div className="pf-liquid-cpk-panel">
      <header>
        <h3 style={{ color: COLORS[liquid] }}>
          Liquid {liquid} — {info.materialName}
        </h3>
        <p className="pf-liquid-meta">
          {info.pumpModel} · ρ {info.density} g/ml · {info.viscosity} cP · droplet {info.dropletUl} µL
        </p>
      </header>

      <div className="pf-cpk-kpi-row">
        <div className={`pf-cpk-kpi ${capable ? "ok" : "warn"}`}>
          <span>Current Cpk</span>
          <strong>{stats.cpk.toFixed(2)}</strong>
          <small>n={snapshot.samples[liquid].length}</small>
        </div>
        <div className="pf-cpk-kpi">
          <span>Mean / Target</span>
          <strong>
            {stats.mean.toFixed(3)} / {target.toFixed(3)} g
          </strong>
        </div>
        <div className="pf-cpk-kpi">
          <span>σ</span>
          <strong>{stats.sigma.toFixed(4)}</strong>
        </div>
      </div>

      <div className="pf-mini-chart">
        <h4>Dose samples (current batch)</h4>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={doseData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#2a3544" strokeDasharray="3 3" />
            <XAxis dataKey="index" stroke="#8b9cb0" fontSize={10} />
            <YAxis stroke="#8b9cb0" fontSize={10} domain={["auto", "auto"]} />
            <Tooltip contentStyle={{ background: "#1a2332", border: "1px solid #2a3544" }} />
            <ReferenceLine y={stats.usl} stroke="#ff5c5c" strokeDasharray="4 4" />
            <ReferenceLine y={stats.lsl} stroke="#ff5c5c" strokeDasharray="4 4" />
            <ReferenceLine y={target} stroke="#8b9cb0" />
            <Bar dataKey="dose" fill={COLORS[liquid]} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="pf-mini-chart">
        <h4>Cpk trend (batch history)</h4>
        {cpkData.length > 0 ? (
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={cpkData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#2a3544" strokeDasharray="3 3" />
              <XAxis dataKey="batch" stroke="#8b9cb0" fontSize={10} />
              <YAxis stroke="#8b9cb0" fontSize={10} domain={[0, "auto"]} />
              <Tooltip contentStyle={{ background: "#1a2332", border: "1px solid #2a3544" }} />
              <ReferenceLine y={snapshot.recipe.cpkTarget} stroke="#3ddc84" strokeDasharray="4 4" />
              <Bar dataKey="cpk" radius={[2, 2, 0, 0]}>
                {cpkData.map((entry) => (
                  <Cell
                    key={entry.batch}
                    fill={entry.cpk >= snapshot.recipe.cpkTarget ? "#3ddc84" : "#ffc857"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="pf-chart-empty">Run a batch to build Cpk history</p>
        )}
      </div>
    </div>
  );
}

export function LiquidCpkCharts({ snapshot }: Props) {
  return (
    <article className="pf-card">
      <h2>Per-liquid SPC / Cpk (target {snapshot.recipe.cpkTarget})</h2>
      <p className="pf-system-ref">
        Reference: {GRACO_PD2K_3K.name} — OEM ratio ±{GRACO_PD2K_3K.ratioAccuracyPct}%, site QA ±
        {snapshot.recipe.tolerancePct}%
      </p>
      <div className="pf-liquid-cpk-grid">
        {(["A", "B", "C"] as LiquidId[]).map((L) => (
          <LiquidCpkPanel key={L} liquid={L} snapshot={snapshot} />
        ))}
      </div>
    </article>
  );
}
