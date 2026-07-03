import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { gramsToMl } from "../data/production-system";
import type { LiquidId, SimulationSnapshot } from "../simulation/types";

interface Props {
  snapshot: SimulationSnapshot;
}

const COLORS: Record<LiquidId, string> = { A: "#4da3ff", B: "#3ddc84", C: "#ffc857" };

export function ConsumptionPanel({ snapshot }: Props) {
  const { consumption, recipe, liquids } = snapshot;

  const tableData = (["A", "B", "C"] as LiquidId[]).map((L) => {
    const target = recipe.targets[L];
    const dispensed = consumption.dispensedGrams[L];
    const dripG = consumption.dripLossMg[L] / 1000;
    const purge = consumption.purgeLossGrams[L];
    const total = consumption.totalConsumedGrams[L];
    const remaining = consumption.tankRemainingMl[L];
    const capacity = remaining + gramsToMl(total, liquids[L].density);
    const pctUsed = capacity > 0 ? (gramsToMl(total, liquids[L].density) / capacity) * 100 : 0;

    return {
      liquid: L,
      material: liquids[L].materialName,
      target,
      dispensed,
      dripG,
      purge,
      total,
      remaining,
      pctUsed,
      variancePct: target > 0 ? ((dispensed - target) / target) * 100 : 0,
    };
  });

  const chartData = tableData.map((row) => ({
    name: `Liq ${row.liquid}`,
    Target: row.target,
    Dispensed: Number(row.dispensed.toFixed(3)),
    Purge: Number(row.purge.toFixed(3)),
    Drip: Number(row.dripG.toFixed(4)),
  }));

  return (
    <article className="pf-card">
      <h2>Material consumption — recipe vs actual</h2>
      <div className="pf-consumption-chart">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#2a3544" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#8b9cb0" fontSize={11} />
            <YAxis stroke="#8b9cb0" fontSize={11} label={{ value: "g", angle: -90, position: "insideLeft", fill: "#8b9cb0" }} />
            <Tooltip contentStyle={{ background: "#1a2332", border: "1px solid #2a3544" }} />
            <Legend />
            <Bar dataKey="Target" fill="#8b9cb0" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Dispensed" radius={[2, 2, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[(["A", "B", "C"] as LiquidId[])[i]!]} />
              ))}
            </Bar>
            <Bar dataKey="Purge" fill="#6b7280" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Drip" fill="#ff5c5c" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table className="pf-consumption-table">
        <thead>
          <tr>
            <th>Liquid</th>
            <th>Recipe target (g)</th>
            <th>Dispensed (g)</th>
            <th>Δ %</th>
            <th>Purge (g)</th>
            <th>Drip (g)</th>
            <th>Total consumed (g)</th>
            <th>Tank remaining (ml)</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.liquid}>
              <td>
                <strong style={{ color: COLORS[row.liquid] }}>{row.liquid}</strong>
                <br />
                <small>{row.material}</small>
              </td>
              <td className="num">{row.target.toFixed(3)}</td>
              <td className="num">{row.dispensed.toFixed(3)}</td>
              <td className={`num ${Math.abs(row.variancePct) > recipe.tolerancePct ? "warn" : ""}`}>
                {row.variancePct >= 0 ? "+" : ""}
                {row.variancePct.toFixed(2)}%
              </td>
              <td className="num">{row.purge.toFixed(3)}</td>
              <td className="num">{row.dripG.toFixed(4)}</td>
              <td className="num">{row.total.toFixed(3)}</td>
              <td className="num">{row.remaining.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
