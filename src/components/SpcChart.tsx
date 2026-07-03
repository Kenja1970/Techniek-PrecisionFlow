import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cpk } from "../simulation/cpk-engine";
import type { LiquidId, SimulationSnapshot } from "../simulation/types";

interface Props {
  snapshot: SimulationSnapshot;
}

const COLORS: Record<LiquidId, string> = { A: "#4da3ff", B: "#3ddc84", C: "#ffc857" };

export function SpcChart({ snapshot }: Props) {
  const maxLen = Math.max(
    snapshot.samples.A.length,
    snapshot.samples.B.length,
    snapshot.samples.C.length,
    1,
  );

  const data = Array.from({ length: maxLen }, (_, i) => ({
    index: i + 1,
    A: snapshot.samples.A[i],
    B: snapshot.samples.B[i],
    C: snapshot.samples.C[i],
  }));

  return (
    <div className="pf-spc-wrap">
      <div className="pf-spc-legend">
        {(["A", "B", "C"] as LiquidId[]).map((L) => {
          const stats = cpk(snapshot.samples[L], snapshot.recipe.targets[L], snapshot.recipe.tolerancePct);
          return (
            <span key={L} style={{ color: COLORS[L] }}>
              Liquid {L} Cpk {stats.cpk.toFixed(2)} (n={snapshot.samples[L].length})
            </span>
          );
        })}
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#2a3544" strokeDasharray="3 3" />
          <XAxis dataKey="index" stroke="#8b9cb0" fontSize={11} />
          <YAxis stroke="#8b9cb0" fontSize={11} />
          <Tooltip contentStyle={{ background: "#1a2332", border: "1px solid #2a3544" }} />
          <Legend />
          {(["A", "B", "C"] as LiquidId[]).map((L) => {
            const target = snapshot.recipe.targets[L];
            const tol = snapshot.recipe.tolerancePct / 100;
            return (
              <g key={L}>
                <ReferenceLine y={target * (1 + tol)} stroke="#ff5c5c" strokeDasharray="4 4" />
                <ReferenceLine y={target * (1 - tol)} stroke="#ff5c5c" strokeDasharray="4 4" />
                <Line
                  type="monotone"
                  dataKey={L}
                  stroke={COLORS[L]}
                  dot={false}
                  connectNulls={false}
                />
              </g>
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
