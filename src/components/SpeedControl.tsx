import type { SimulationSnapshot } from "../simulation/types";

interface Props {
  snapshot: SimulationSnapshot;
  onSpeedChange: (factor: number) => void;
}

const SPEED_PRESETS = [
  { label: "0.25×", value: 0.25 },
  { label: "0.5×", value: 0.5 },
  { label: "1×", value: 1 },
  { label: "2×", value: 2 },
  { label: "4×", value: 4 },
];

export function SpeedControl({ snapshot, onSpeedChange }: Props) {
  const mins = Math.floor(snapshot.elapsedSimSec / 60);
  const secs = Math.floor(snapshot.elapsedSimSec % 60);

  return (
    <article className="pf-card pf-speed-card">
      <h2>Simulation time control</h2>
      <div className="pf-speed-meta">
        <span>
          Elapsed: <strong>{mins}:{secs.toString().padStart(2, "0")}</strong>
        </span>
        <span>
          Scan: <strong>{snapshot.scanMs} ms</strong> ({snapshot.speedFactor.toFixed(2)}×)
        </span>
        <span>
          Phase ticks left: <strong>{snapshot.phaseTicksRemaining}</strong>
        </span>
      </div>
      <label className="pf-speed-slider-label" htmlFor="speedSlider">
        Simulation speed — drag left to run slower
      </label>
      <input
        id="speedSlider"
        type="range"
        min={0.1}
        max={4}
        step={0.05}
        value={snapshot.speedFactor}
        onChange={(e) => onSpeedChange(Number(e.target.value))}
        className="pf-speed-slider"
      />
      <div className="pf-speed-presets">
        {SPEED_PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            className={snapshot.speedFactor === p.value ? "active" : ""}
            onClick={() => onSpeedChange(p.value)}
          >
            {p.label}
          </button>
        ))}
      </div>
    </article>
  );
}
