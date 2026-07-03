import { useSimulationStore } from "./store/useSimulationStore";
import {
  AlarmBuffer,
  BatchRecord,
  ControllerPanel,
  InterlockList,
  TagMonitor,
} from "./components/DashboardPanels";
import { KpiRow } from "./components/KpiRow";
import { ProcessLineMimic } from "./components/ProcessLineMimic";
import { SafetyBanner } from "./components/SafetyBanner";
import { SpcChart } from "./components/SpcChart";
import type { Recipe } from "./simulation/types";

export function App() {
  const snapshot = useSimulationStore((s) => s.snapshot);
  const setRecipe = useSimulationStore((s) => s.setRecipe);
  const start = useSimulationStore((s) => s.start);
  const stop = useSimulationStore((s) => s.stop);
  const reset = useSimulationStore((s) => s.reset);
  const exportBatch = useSimulationStore((s) => s.exportBatch);

  return (
    <div className="pf-app">
      <header className="pf-top">
        <div>
          <h1>Techniek PrecisionFlow</h1>
          <p>Droplet-level precision · Industrial flow intelligence · Hazard-ready operations</p>
        </div>
      </header>

      <SafetyBanner snapshot={snapshot} />

      <div className="pf-grid">
        <section>
          <KpiRow snapshot={snapshot} />
          <article className="pf-card">
            <h2>Process line — P&amp;ID-style overview</h2>
            <ProcessLineMimic snapshot={snapshot} />
            <div className="pf-toolbar">
              <select
                aria-label="Recipe"
                value={snapshot.recipe.id}
                onChange={(e) => setRecipe(e.target.value)}
              >
                {Object.values(snapshot.recipes).map((r: Recipe) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <button type="button" className="primary" onClick={start}>
                Start batch
              </button>
              <button type="button" onClick={stop}>
                Stop
              </button>
              <button type="button" onClick={reset}>
                Reset line
              </button>
              <button type="button" onClick={exportBatch}>
                Export batch record
              </button>
            </div>
          </article>
          <article className="pf-card pf-card-spaced">
            <h2>SPC — dose capability (Cpk target 1.67)</h2>
            <SpcChart snapshot={snapshot} />
          </article>
        </section>

        <aside className="pf-right">
          <article className="pf-card">
            <h2>PLC-style controller</h2>
            <ControllerPanel snapshot={snapshot} />
          </article>
          <article className="pf-card">
            <h2>Tag monitor</h2>
            <TagMonitor snapshot={snapshot} />
          </article>
          <article className="pf-card">
            <h2>Alarm / event buffer</h2>
            <AlarmBuffer snapshot={snapshot} />
          </article>
          <article className="pf-card">
            <h2>Process safety interlocks</h2>
            <InterlockList snapshot={snapshot} />
          </article>
          <article className="pf-card">
            <h2>Batch record</h2>
            <BatchRecord snapshot={snapshot} />
          </article>
        </aside>
      </div>
    </div>
  );
}
