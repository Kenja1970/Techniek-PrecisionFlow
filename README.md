# Techniek PrecisionFlow

A web-based digital twin and HMI-style dashboard for a simulated three-liquid precision dosing and mixing line.

The application models droplet-scale hazardous-material dosing, zero-drip control, PLC-style state monitoring, recipe execution, SPC/Cpk analytics, QA/QC gates, process-safety gates, hazardous-material dashboards, SIF/interlock placeholders, containment, ventilation, gas/vapor/exposure alarms, emergency response workflows, batch records, maintenance, audit trails, and nightly quality/safety checks.

**Tagline:** Droplet-level precision. Industrial flow intelligence. Hazard-ready operations.

## Default process assumptions

- Three liquids: A, B, C
- Dose accuracy: ±0.1%
- Initial centered Cpk: 1.67
- Mass-based verification
- Configurable droplet equivalent
- Simulated zero-drip control

This application is a **simulation**. It is not a certified PLC, safety controller, HMI, SCADA, MES, or validated production system.

## Local development

```powershell
cd tools/Techniek-PrecisionFlow
npm install
npm run dev
```

Open http://localhost:5173

## Verify (test + build)

```powershell
npm run verify
```

## Specification

Full product specification: [`techniek_precisionflow_automated_dosing_system.md`](./techniek_precisionflow_automated_dosing_system.md)

Development plan and phased roadmap: [`DEVELOPMENT.md`](./DEVELOPMENT.md)

## Repository layout

| Path | Purpose |
|------|---------|
| `src/simulation/` | Dosing engine, Cpk engine, line state machine |
| `src/data/` | Default liquids, recipes, equipment seed data |
| `src/components/` | HMI dashboard panels |
| `src/store/` | Zustand telemetry store |

## Remote

Standalone GitHub repo: `Kenja1970/Techniek-PrecisionFlow`

Monorepo path: `Techniek_Codex/tools/Techniek-PrecisionFlow`

Published static preview (legacy scaffold): `Techniek_Codex/outputs/tools/precisionflow/`
