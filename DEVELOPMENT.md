# Techniek PrecisionFlow — Development Plan

This plan follows **Section 22 (Suggested First Build Sequence)** from the product specification and maps each phase to local development and test gates.

## Phase 0 — Repository setup (done)

- [x] Create `tools/Techniek-PrecisionFlow` source tree
- [x] Vite + React + TypeScript + Zustand scaffold per spec §5.1
- [x] README and `.gitignore`
- [x] GitHub repo `Kenja1970/Techniek-PrecisionFlow`

## Phase 1 — Core simulation (done)

| Step | Spec ref | Deliverable | Test gate |
|------|----------|-------------|-----------|
| 1 | §22.1 | App scaffold | `npm run build` |
| 2 | §22.2 | Liquids, recipes, types | unit tests |
| 3 | §22.3 | Line state machine (15 phases) | `dosing-engine.test.ts` |
| 4 | §22.4 | Three-liquid dosing + Cpk engine | `cpk-engine.test.ts` |
| 5 | §22.5 | Zustand telemetry store | manual dev server |

**Local verify:** `npm run verify`

## Phase 2 — Operator dashboard (done — MVP)

| Step | Spec ref | Deliverable |
|------|----------|-------------|
| 6 | §22.6 | Overview KPI row, safety banner |
| 7 | §22.7 | Dosing station faceplates (P&ID mimic) |
| 8 | §22.8 | Line mimic with pump state |
| 9 | §22.9 | SPC/Cpk charts (Recharts) |
| 10 | §22.10 | Alarm buffer |
| — | §9 | PLC controller panel, tag monitor, interlocks, batch record |

**Manual test checklist:**

1. Start **Standard 3-liquid batch** — phase advances, pumps highlight, tags update
2. Select **Draft recipe** — start blocked, safety banner shows alert
3. Run full batch — alarms populate, Cpk chart updates, export JSON works
4. Stop / Reset — line returns to idle

## Phase 3 — Recipe, QA, and safety depth (next)

| Step | Spec ref | Deliverable | Test |
|------|----------|-------------|------|
| 11 | §11 | Recipe manager with lock/approval | integration |
| 12 | §12 | Batch record page with QA gates | integration |
| 13 | §12 | QA/QC dashboard, deviation log | unit + e2e |
| 14 | §15 | Process-safety dashboard, hazard gate | unit |
| 15 | §15 | HAZOP/LOPA/SIF placeholder records | docs + tests |

## Phase 4 — Platform hardening (future)

| Step | Spec ref | Deliverable |
|------|----------|-------------|
| 16 | §15.10 | Emergency-response workflows |
| 17 | §12.5 | Audit trail with immutable events |
| 18 | §13 | Validation docs under `/docs` |
| 19 | §20 | Nightly GitHub Actions workflow |
| 20 | §16–27 | Full design system, wallboard/tablet modes |

## Local development workflow

```powershell
# From tools/Techniek-PrecisionFlow
npm install          # once
npm run dev          # hot reload at :5173
npm test             # Vitest unit tests
npm run build        # production bundle → dist/
npm run verify       # test + build
```

## Publishing to Techniek_Codex site

After `npm run build`, copy `dist/` assets to `outputs/tools/precisionflow/` for GitHub Pages static hosting (or add a publish script in a later phase).

## Non-negotiable constraints (spec §23)

- Simulation only — no real equipment connection
- Never hide Cpk sample size
- Never allow failed QA gates to appear released
- Hazard profile must block recipe approval when incomplete

## Definition of done (current milestone)

Phase 1–2 MVP is complete when:

1. `npm run verify` passes locally
2. Dashboard runs at `npm run dev`
3. Unit tests cover engine start/block/phase walk and Cpk math
4. Source pushed to `Kenja1970/Techniek-PrecisionFlow` and `Techniek_Codex/tools/Techniek-PrecisionFlow`
