import {
  PIPE_RUNS,
  PREHEAT_LOOPS,
  totalPipeLengthM,
} from "../data/facility-layout";
import type { LiquidId, SimulationSnapshot } from "../simulation/types";

interface Props {
  snapshot: SimulationSnapshot;
}

const LIQ_COLOR: Record<LiquidId, string> = { A: "#4da3ff", B: "#3ddc84", C: "#ffc857" };

export function FacilityLayoutDiagram({ snapshot }: Props) {
  const active = (liquid: string) =>
    snapshot.phase.includes(`dose_${liquid}`) ||
    snapshot.phase.includes(`verify_${liquid}`);

  const roomPipes = (liquid: LiquidId) =>
    PIPE_RUNS.filter((p) => p.liquid === liquid);

  return (
    <div className="pf-facility-wrap">
      <svg
        className="pf-facility-svg"
        viewBox="0 0 920 520"
        aria-label="Facility layout with partitionable rooms and piping"
      >
        <defs>
          <pattern id="hatch-fire" patternUnits="userSpaceOnUse" width="8" height="8">
            <path d="M0 8 L8 0 M-2 2 L2 -2 M6 10 L10 6" stroke="#ff5c5c44" strokeWidth="1" />
          </pattern>
        </defs>

        {/* RM-101 Corrosive */}
        <g id="rm-101">
          <rect x="20" y="30" width="200" height="200" className="pf-room pf-room-corrosive" />
          <text x="120" y="52" className="pf-room-title" textAnchor="middle">
            RM-101
          </text>
          <text x="120" y="68" className="pf-room-sub" textAnchor="middle">
            Corrosive · 4.5×5.0 m
          </text>
          <rect x="40" y="90" width="50" height="60" className="pf-tank" />
          <text x="65" y="125" className="pf-equip-label" textAnchor="middle">
            TK-101A
          </text>
          <rect x="110" y="100" width="40" height="40" className="pf-hx" />
          <text x="130" y="125" className="pf-equip-label" textAnchor="middle">
            HX-101
          </text>
          <rect
            x="165"
            y="105"
            width="30"
            height="35"
            className={`pf-pump ${active("a") ? "active" : ""}`}
          />
          <text x="180" y="127" className="pf-pump-label" textAnchor="middle">
            A
          </text>
          {/* Pipe A */}
          <path
            d="M65 150 H110 M150 140 H165"
            stroke={LIQ_COLOR.A}
            strokeWidth="3"
            fill="none"
            className="pf-pipe-run"
          />
          <text x="88" y="145" className="pf-pipe-label">
            3/8&quot; 2.4 m
          </text>
          <text x="155" y="135" className="pf-pipe-label">
            1/4&quot; 1.8 m
          </text>
          <text x="120" y="195" className="pf-pipe-note" textAnchor="middle">
            {snapshot.preheat.tempC.A.toFixed(1)} °C · {Math.round(snapshot.preheat.powerW.A)} W
          </text>
        </g>

        {/* RM-102 Flammable */}
        <g id="rm-102">
          <rect x="240" y="30" width="220" height="200" className="pf-room pf-room-flammable" fill="url(#hatch-fire)" />
          <rect x="240" y="30" width="220" height="200" className="pf-room pf-room-flammable" fill="none" />
          <text x="350" y="52" className="pf-room-title" textAnchor="middle">
            RM-102
          </text>
          <text x="350" y="68" className="pf-room-sub" textAnchor="middle">
            Flammable · 5.0×6.0 m · 2-hr wall
          </text>
          <rect x="260" y="90" width="50" height="60" className="pf-tank" />
          <text x="285" y="125" className="pf-equip-label" textAnchor="middle">
            TK-102B
          </text>
          <rect
            x="340"
            y="105"
            width="30"
            height="35"
            className={`pf-pump ${active("b") ? "active" : ""}`}
          />
          <text x="355" y="127" className="pf-pump-label" textAnchor="middle">
            B
          </text>
          <path d="M310 120 H340" stroke={LIQ_COLOR.B} strokeWidth="4" fill="none" />
          <text x="325" y="112" className="pf-pipe-label">
            3/8&quot; 3.2 m
          </text>
          <circle cx="400" cy="120" r="6" className="pf-sensor" />
          <text x="400" y="108" className="pf-pipe-label" textAnchor="middle">
            LEL
          </text>
        </g>

        {/* RM-103 Toxic */}
        <g id="rm-103">
          <rect x="480" y="30" width="180" height="200" className="pf-room pf-room-toxic" />
          <text x="570" y="52" className="pf-room-title" textAnchor="middle">
            RM-103
          </text>
          <text x="570" y="68" className="pf-room-sub" textAnchor="middle">
            Toxic · 3.5×4.0 m · neg. pressure
          </text>
          <rect x="500" y="95" width="40" height="50" className="pf-tank" />
          <text x="520" y="125" className="pf-equip-label" textAnchor="middle">
            TK-103C
          </text>
          <rect x="555" y="100" width="35" height="30" className="pf-hx heating" />
          <text x="572" y="118" className="pf-equip-label" textAnchor="middle">
            HX-103
          </text>
          <rect
            x="610"
            y="105"
            width="28"
            height="32"
            className={`pf-pump ${active("c") ? "active" : ""}`}
          />
          <text x="624" y="125" className="pf-pump-label" textAnchor="middle">
            C
          </text>
          <path
            d="M540 120 H555 M590 115 H610"
            stroke={LIQ_COLOR.C}
            strokeWidth="2"
            fill="none"
          />
          <text x="548" y="112" className="pf-pipe-label">
            1/8&quot; PTFE
          </text>
          <text x="570" y="195" className="pf-pipe-note" textAnchor="middle">
            {snapshot.preheat.tempC.C.toFixed(1)} °C · {Math.round(snapshot.preheat.powerW.C)} W
          </text>
        </g>

        {/* Airlocks & transfer corridor */}
        <g id="corridor">
          <rect x="20" y="250" width="640" height="50" className="pf-corridor" />
          <text x="340" y="280" className="pf-corridor-label" textAnchor="middle">
            Transfer corridor — piped sleeves AL-1 / AL-2
          </text>
          {/* Long pipe runs to mixer */}
          <path
            d="M180 200 V250 H120 V300 M355 200 V300 M624 200 V300"
            stroke={LIQ_COLOR.A}
            strokeWidth="2"
            strokeDasharray="6 4"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M355 140 H355 200 V300"
            stroke={LIQ_COLOR.B}
            strokeWidth="3"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M624 140 V300"
            stroke={LIQ_COLOR.C}
            strokeWidth="2"
            fill="none"
            opacity="0.7"
          />
          <text x="130" y="320" className="pf-pipe-label">
            A: 1/4&quot; SS · 8.5 m total
          </text>
          <text x="330" y="320" className="pf-pipe-label">
            B: 3/8&quot; SS · 12.0 m
          </text>
          <text x="530" y="320" className="pf-pipe-label">
            C: 1/8&quot; PTFE · 6.0 m
          </text>
        </g>

        {/* RM-104 Mix & QA */}
        <g id="rm-104">
          <rect x="20" y="320" width="640" height="170" className="pf-room pf-room-mix" />
          <text x="340" y="342" className="pf-room-title" textAnchor="middle">
            RM-104 Mix &amp; QA release
          </text>
          <text x="340" y="358" className="pf-room-sub" textAnchor="middle">
            6.0×5.5 m · washdown partition to corridor
          </text>
          <rect x="80" y="380" width="80" height="70" className="pf-tank" />
          <text x="120" y="420" className="pf-equip-label" textAnchor="middle">
            Infeed
          </text>
          <rect x="280" y="375" width="100" height="80" className="pf-mixer" />
          <text x="330" y="420" className="pf-equip-label" textAnchor="middle">
            MV-104 Mixer
          </text>
          <rect x="500" y="380" width="90" height="70" className="pf-tank" />
          <text x="545" y="420" className="pf-equip-label" textAnchor="middle">
            QA / Release
          </text>
          <path d="M160 415 H280 M380 415 H500" className="pf-conveyor" strokeWidth="3" fill="none" />
          {/* Nozzle connections */}
          <circle cx="300" cy="375" r="5" fill={LIQ_COLOR.A} />
          <circle cx="330" cy="375" r="5" fill={LIQ_COLOR.B} />
          <circle cx="360" cy="375" r="5" fill={LIQ_COLOR.C} />
          <text x="330" y="368" className="pf-pipe-label" textAnchor="middle">
            3× dose nozzles
          </text>
        </g>

        {/* Partition wall indicators */}
        <line x1="220" y1="30" x2="220" y2="230" className="pf-partition" />
        <line x1="460" y1="30" x2="460" y2="230" className="pf-partition" />
        <line x1="680" y1="30" x2="680" y2="490" className="pf-partition" />
        <line x1="20" y1="310" x2="660" y2="310" className="pf-partition" />

        {/* Legend */}
        <g transform="translate(700, 40)">
          <rect x="0" y="0" width="200" height="200" className="pf-legend-box" />
          <text x="100" y="20" className="pf-room-title" textAnchor="middle">
            Piping summary
          </text>
          {(["A", "B", "C"] as LiquidId[]).map((L, i) => {
            const pipes = roomPipes(L);
            const total = totalPipeLengthM(L);
            return (
              <text key={L} x="10" y={45 + i * 36} className="pf-legend-item">
                <tspan fill={LIQ_COLOR[L]} fontWeight="bold">
                  {L}:
                </tspan>{" "}
                {total.toFixed(1)} m total · {pipes[0]?.sizeLabel} {pipes[0]?.material}
                {PREHEAT_LOOPS[L].required ? ` · ${PREHEAT_LOOPS[L].setpointC}°C` : ""}
              </text>
            );
          })}
          <text x="10" y="165" className="pf-legend-note">
            Partition walls: fire-rated (B), toxic containment (C)
          </text>
        </g>
      </svg>
    </div>
  );
}
