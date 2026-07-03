import type { SimulationSnapshot } from "../simulation/types";

interface Props {
  snapshot: SimulationSnapshot;
}

export function ProcessLineMimic({ snapshot }: Props) {
  const active = (liquid: string) =>
    snapshot.phase.includes(`dose_${liquid}`) ||
    snapshot.phase.includes(`verify_${liquid}`);

  return (
    <svg className="pf-process" viewBox="0 0 720 220" aria-label="Dosing line diagram">
      <path className="pipe" d="M40 110 H680" />
      <rect className="tank" x="60" y="70" width="70" height="80" rx="6" />
      <text x="95" y="115" fill="#8b9cb0" fontSize="11" textAnchor="middle">
        Infeed
      </text>
      <rect className={`pump ${active("a") ? "active" : ""}`} x="170" y="85" width="36" height="50" rx="4" />
      <text x="188" y="112" fill="#0c0f12" fontSize="10" textAnchor="middle">
        A
      </text>
      <rect className={`pump ${active("b") ? "active" : ""}`} x="300" y="85" width="36" height="50" rx="4" />
      <text x="318" y="112" fill="#0c0f12" fontSize="10" textAnchor="middle">
        B
      </text>
      <rect className={`pump ${active("c") ? "active" : ""}`} x="430" y="85" width="36" height="50" rx="4" />
      <text x="448" y="112" fill="#0c0f12" fontSize="10" textAnchor="middle">
        C
      </text>
      <rect className="tank" x="540" y="60" width="90" height="100" rx="8" />
      <text x="585" y="115" fill="#8b9cb0" fontSize="11" textAnchor="middle">
        Mixer / QA
      </text>
      <circle className="valve" cx="250" cy="110" r="10" />
      <circle className="valve" cx="380" cy="110" r="10" />
    </svg>
  );
}
