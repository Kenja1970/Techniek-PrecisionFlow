import { useSimulationStore } from "./store/useSimulationStore";
import {
  AlarmBuffer,
  BatchRecord,
  ControllerPanel,
  InterlockList,
  TagMonitor,
} from "./components/DashboardPanels";
import { ConsumptionPanel } from "./components/ConsumptionPanel";
import { FacilityLayoutDiagram } from "./components/FacilityLayoutDiagram";
import { KpiRow } from "./components/KpiRow";
import { LiquidCpkCharts } from "./components/LiquidCpkCharts";
import { PreheatPanel } from "./components/PreheatPanel";
import { ProductionSystemPanel } from "./components/ProductionSystemPanel";
import { SafetyBanner } from "./components/SafetyBanner";
import { SpeedControl } from "./components/SpeedControl";
import { SpcChart } from "./components/SpcChart";
import type { Recipe } from "./simulation/types";

export function App() {
  const snapshot = useSimulationStore((s) => s.snapshot);
  const setRecipe = useSimulationStore((s) => s.setRecipe);
  const setSpeed = useSimulationStore((s) => s.setSpeed);
  const start = useSimulationStore((s) => s.start);
  const stop = useSimulationStore((s) => s.stop);
  const reset = useSimulationStore((s) => s.reset);
  const exportBatch = useSimulationStore((s) => s.exportBatch);
  const preheatLine = useSimulationStore((s) => s.preheatLine);

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
          <SpeedControl snapshot={snapshot} onSpeedChange={setSpeed} />
          <article className="pf-card pf-card-spaced">
            <h2>Facility layout — partitionable rooms &amp; piping</h2>
            <FacilityLayoutDiagram snapshot={snapshot} />
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
              <button type="button" onClick={preheatLine}>
                Preheat line
              </button>
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
          <div className="pf-card-spaced">
            <PreheatPanel snapshot={snapshot} />
          </div>
          <div className="pf-card-spaced">
            <ConsumptionPanel snapshot={snapshot} />
          </div>
          <div className="pf-card-spaced">
            <LiquidCpkCharts snapshot={snapshot} />
          </div>
          <article className="pf-card pf-card-spaced">
            <h2>Combined SPC — all liquids</h2>
            <SpcChart snapshot={snapshot} />
          </article>
        </section>

        <aside className="pf-right">
          <ProductionSystemPanel />
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
