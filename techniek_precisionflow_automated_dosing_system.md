# Techniek PrecisionFlow Automated Hazardous Dosing System Web Application Specification

**File purpose:** Implementation-ready Markdown for Codex, Cursor, or another agentic development environment to build a web-based simulation, monitoring, analytics, process-safety, emergency-response, and QA/QC application for an automated precision dosing and mixing production line handling a hazardous product.

**Product name:** `Techniek PrecisionFlow`

**Product tagline:** `Droplet-level precision. Industrial flow intelligence. Hazard-ready operations.`

**Product description:** `Techniek PrecisionFlow is a precision hazardous-material dosing digital twin and HMI-style operations platform for automated multi-liquid production lines requiring droplet-level accuracy, process capability monitoring, QA/QC traceability, and process-safety rigor.`

**Brand family:** `Techniek industrial intelligence / precision automation tools`

**Trademark note:** `Techniek PrecisionFlow is a proposed product name and has not been trademark-cleared.`

**Important scope boundary:** This application is a web-based digital twin, HMI-style dashboard, analytics engine, and QA/QC management layer. It must not directly operate real production equipment unless a licensed controls engineer, safety engineer, quality owner, and site automation owner formally validate and approve the interface. Any later physical connection to pumps, valves, PLCs, scales, flowmeters, mixers, gas detectors, ventilation systems, fire protection systems, emergency shutdown systems, or safety instrumented systems requires a separate controls specification, PHA/HAZOP, LOPA/SIL assessment, cybersecurity review, validation package, pre-startup safety review, emergency response review, and management of change.

---

## 1. Product Vision

Build a production-grade web application that replicates an automated dosing system encapsulating a hazardous-material production line where three different liquids are dispensed with droplet-scale precision, zero-drip control, continuous process capability monitoring, formal process-safety logic, containment, exposure controls, and emergency response visualization.

The application shall simulate and visualize a high-accuracy automated line where Liquid A, Liquid B, and Liquid C are dosed into a moving product stream or container train as the material progresses through staged dosing, verification, mixing, quality hold/release, reject diversion, hazardous-energy isolation, ventilation, gas/vapor monitoring, secondary containment, and emergency shutdown scenarios.

The system shall include expert-level dashboard readouts analogous to a Siemens SIMATIC S7-style PLC/HMI environment: controller status, scan cycle, tag table, I/O state, alarm/event buffer, recipe state, batch records, closed-loop dosing control, live SPC/Cpk, equipment health, process-safety interlocks, hazardous-material safeguards, safety instrumented function placeholders, trends, and production diagnostics.

---

## 2. Core Assumptions

### 2.1 Process Assumptions

- The production line handles **three liquids**: `Liquid A`, `Liquid B`, and `Liquid C`.
- Each liquid has independent physical characteristics:
  - Density
  - Viscosity
  - Surface tension
  - Temperature sensitivity
  - Vapor/air entrainment risk
  - Material compatibility notes
  - Calibration curve
  - Pump/valve response profile
- Default dose accuracy requirement: **±0.1% of target dose**.
- Default process capability target: **Cpk = 1.67**.
- Default dose unit model:
  - Mass-based primary measurement, e.g. grams or milligrams.
  - Volume-based secondary measurement, e.g. mL, µL, or droplet equivalent.
- Default droplet model:
  - One nominal droplet = `50 µL`.
  - Droplet volume is configurable by liquid because droplet size varies by fluid, nozzle, temperature, surface tension, and dispensing method.
- “No drop” means **zero-drip / zero-lost-droplet control**, not an impossible physical guarantee. The simulation shall model:
  - Post-dispense drip risk
  - Anti-drip valve closure time
  - Suck-back/reverse-pulse compensation
  - Nozzle wetting state
  - Drip detection event
  - Lost-drop mass/volume ledger
  - Reject logic if detected loss exceeds threshold


### 2.2 Hazardous Product Assumptions

Assume the line handles a hazardous product until proven otherwise. The application shall default to a conservative safety posture and require the developer to explicitly model hazardous-material risk rather than treating safety as a generic alarm layer.

Default hazardous-product posture:

- The product may be **toxic, corrosive, flammable, reactive, sensitizing, environmentally hazardous, or incompatible with common materials**.
- The exact chemical identity is configurable, but the application shall require a complete placeholder hazard profile before a recipe can be marked production-ready.
- Each liquid shall have a linked Safety Data Sheet / SDS placeholder, GHS pictograms, signal word, hazard statements, precautionary statements, exposure limits, incompatibilities, storage class, spill response guidance, and disposal notes.
- If flammable or combustible hazards are enabled, the simulation shall require placeholders for classified-area review, ignition-source control, bonding/grounding, ventilation, LEL monitoring, and fire protection.
- If toxic inhalation hazards are enabled, the simulation shall require placeholders for local exhaust ventilation, gas/vapor detection, occupational exposure limits, alarms at warning/action/evacuation levels, PPE, and emergency response.
- If corrosive hazards are enabled, the simulation shall require placeholders for eyewash/shower location, compatible materials, containment, drain isolation, PPE, and neutralization/spill kit availability.
- If reactive hazards are enabled, the simulation shall require placeholders for incompatible mixing prevention, temperature runaway detection, pressure relief, quench/kill-step placeholder, and maximum allowable accumulation.
- If environmental hazards are enabled, the simulation shall require placeholders for secondary containment, sump status, drain valve interlock, spill mass estimate, and reportable quantity placeholder.

Conservative default rule:

```text
IF hazardProfile.complete = FALSE THEN
  block recipe approval
  block batch release
  show Process Safety Incomplete banner
END IF
```

The application shall support a **simulation-only safety lifecycle** that mirrors real process-safety expectations:

1. Hazard identification
2. Consequence screening
3. Safeguard assignment
4. Interlock and alarm definition
5. Safety instrumented function placeholder definition
6. Validation test case generation
7. Management of change review
8. Pre-startup safety review checklist
9. Operating procedure and emergency response review
10. Periodic proof-test and audit schedule

### 2.3 Production Line Assumptions

The simulated line shall include the following sequence:

1. Infeed / product carrier detection
2. Container/product ID assignment
3. Pre-dose tare or baseline measurement
4. Liquid A dose
5. Liquid A mass/volume verification
6. Interim mix or dwell
7. Liquid B dose
8. Liquid B verification
9. Interim mix or dwell
10. Liquid C dose
11. Liquid C verification
12. Final mixing stage
13. QA sample/hold/release decision
14. Reject/divert if nonconforming
15. Batch record closure
16. Outfeed and production summary

### 2.4 Controls Analogy

The UI and data model shall be analogous to a Siemens S7-style controller/HMI environment but must not claim to be Siemens, use Siemens intellectual property, or misrepresent itself as certified PLC/HMI software.

Use names such as:

- `PLC-style Controller`
- `S7-like Controller View`
- `Controller Rack View`
- `HMI Faceplate`
- `Tag Monitor`
- `Diagnostics Buffer`
- `Scan Cycle Monitor`
- `I/O Image Table`

---

## 3. Standards and Reference Alignment

Design the application around recognized industrial automation, validation, and cybersecurity principles.

### 3.1 Recommended Reference Standards

- **PLC/HMI architecture inspiration:** Siemens SIMATIC S7-1500-class controller concepts, diagnostics, TIA Portal-style tag and diagnostic thinking.
- **PLC software model:** IEC 61131-3 concepts such as function blocks, structured text-like logic, ladder-style interlocks, sequential function charts, timers, counters, and scan cycles.
- **Batch/recipe structure:** ISA-88 / IEC 61512 batch control principles for recipes, procedures, unit procedures, operations, phases, equipment modules, and control modules.
- **Enterprise integration:** ISA-95 / IEC 62264 concepts for separating enterprise, MES, SCADA, control, and field levels.
- **Industrial cybersecurity:** ISA/IEC 62443 and NIST SP 800-82 guidance for OT security, network zoning, least privilege, auditability, and safe remote access.
- **Electronic records, when regulated:** 21 CFR Part 11-style audit trails, electronic signatures, record retention, role-based access, and controlled changes.
- **Computerized system validation, when regulated:** GAMP 5-style risk-based validation, user requirements, functional specifications, design specifications, traceability, IQ/OQ/PQ, and lifecycle controls.


### 3.2 Hazardous-Material and Process-Safety Reference Alignment

The application shall include placeholders and validation checks aligned with recognized hazardous-process practices. These are not a substitute for site-specific professional engineering, legal review, or regulatory applicability determinations.

- **OSHA Process Safety Management / PSM:** If the material inventory or process conditions resemble a highly hazardous chemical process, include placeholders for process safety information, process hazard analysis, operating procedures, training, mechanical integrity, management of change, incident investigation, emergency planning, pre-startup safety review, and compliance audits.
- **EPA Risk Management Program / RMP:** If the process could involve regulated substances above thresholds, include placeholders for hazard assessment, prevention program elements, emergency response coordination, and offsite consequence analysis metadata.
- **OSHA Hazard Communication:** Require SDS/GHS metadata, hazard communication fields, labeling state, signal word, pictograms, PPE, first-aid text, and storage/handling precautions.
- **Functional safety:** Use IEC 61511 / ISA-84-style concepts for safety instrumented systems in process industries, including SIF, SIL placeholder, proof-test interval, bypass control, independent protection layer, and safety requirements specification fields.
- **Alarm management:** Use ISA-18.2-style alarm rationalization concepts: alarm priority, consequence, operator action, response time, shelving, suppression, flood analysis, and alarm-performance KPIs.
- **High-performance HMI / SCADA screen design:** Apply ISA-101-style principles for hierarchy, situational awareness, display philosophy, graphics discipline, and operator usability.
- **Process graphics / symbology:** Use ISA-5.1 / P&ID-style symbol conventions as inspiration for tanks, valves, pumps, transmitters, flow paths, and instrumentation labeling.
- **Fire/explosion controls:** When flammable or combustible liquids are enabled, include NFPA 30-style storage/handling placeholders, NFPA 70 / NEC hazardous-location placeholders, LEL monitoring, ignition-source control, bonding/grounding, and ventilation adequacy checks.
- **Occupational exposure controls:** Apply the NIOSH hierarchy of controls in the app logic: elimination/substitution first, then engineering controls, administrative controls, and PPE as the least-preferred layer.
- **Emergency response:** Include spill, exposure, vapor release, fire, evacuation, shelter-in-place, first-aid, incident-command, and external-notification placeholders.
- **Environmental protection:** Include containment, drain isolation, waste characterization, reportable quantity, and release ledger placeholders.

### 3.3 References for Developer Context

- Siemens SIMATIC S7-1500 official product overview and diagnostics concepts.
- ISA-88 batch control standard family.
- ISA-95 enterprise-control system integration standard family.
- ISA/IEC 62443 industrial automation and control system cybersecurity standard family.
- NIST SP 800-82 Rev. 3 Guide to Operational Technology Security.
- FDA 21 CFR Part 11 electronic records/electronic signatures, if the modeled line is pharmaceutical, biotech, food safety, medical device, or otherwise regulated.
- ISPE GAMP 5 Second Edition for risk-based computerized system validation, if regulated.
- OSHA 29 CFR 1910.119 Process Safety Management, where applicable.
- EPA 40 CFR Part 68 Risk Management Program, where applicable.
- OSHA 29 CFR 1910.1200 Hazard Communication, where applicable.
- ISA/IEC 61511 / ISA-84 functional safety concepts for safety instrumented systems in the process industry.
- NFPA 30 and NFPA 70 hazardous-material, flammable-liquid, and hazardous-location placeholders, where applicable.
- NIOSH hierarchy of controls for exposure-reduction logic.

---

## 4. Primary User Roles

### 4.1 Operator

- Starts/stops simulation runs.
- Selects approved recipes.
- Monitors line state.
- Responds to alarms.
- Confirms reject/hold/release events.
- Cannot edit locked recipes, QA limits, Cpk rules, or safety interlocks.

### 4.2 Quality Engineer

- Reviews dose accuracy, Cpk, Cp, Ppk, trend data, deviations, and batch history.
- Approves or rejects batch records.
- Manages QA/QC checks and acceptance criteria.
- Creates deviation and CAPA records.
- Reviews audit trails.

### 4.3 Process Engineer

- Tunes simulation parameters.
- Manages pump curves, valve timing, density, viscosity, temperature compensation, and mixing assumptions.
- Reviews equipment health and calibration drift.
- Proposes process improvements.


### 4.4 EHS / Process Safety Engineer

- Owns hazardous-material assumptions, process safety information, hazard register, PHA/HAZOP nodes, LOPA placeholders, emergency-response metadata, exposure limits, and safeguards.
- Approves changes to safety limits, emergency shutdown logic, gas/vapor alarm levels, ventilation requirements, and containment assumptions.
- Reviews safety event history, bypasses, alarm floods, near misses, and safety-critical maintenance.
- Cannot be bypassed for recipe approval when hazardous-material flags are active.

### 4.5 Industrial Hygienist / Exposure Reviewer

- Reviews SDS fields, occupational exposure limits, vapor/aerosol assumptions, ventilation adequacy, sampling strategy placeholders, PPE, and exposure-alarm thresholds.
- Reviews simulated worker-exposure events and required corrective actions.

### 4.6 Emergency Response Coordinator

- Reviews simulated spill, leak, toxic vapor, fire, evacuation, shelter-in-place, and first-aid workflows.
- Maintains emergency contact placeholders, muster-zone map placeholders, incident-command checklist, and drill records.

### 4.7 Controls Engineer

- Reviews controller logic, state machines, interlocks, simulated scan cycles, tag structures, and I/O mappings.
- Manages PLC-like function blocks in the simulation.
- Reviews alarm classes and control narratives.

### 4.8 Maintenance Technician

- Views pump cycles, valve cycles, nozzle condition, calibration due dates, preventive maintenance status, and fault history.
- Records maintenance actions.

### 4.9 Administrator

- Manages users, roles, permissions, audit retention, system configuration, feature flags, integrations, and backup policies.

---

## 5. Application Architecture

### 5.1 Recommended Stack

Build as a modern web application with a clean separation between simulation, API, dashboard, analytics, and data persistence.

Recommended default stack:

- Front end: `React + TypeScript + Vite`
- Styling: `Tailwind CSS` or carefully structured CSS modules
- Charts: `Recharts`, `ECharts`, or `Plotly` for SPC and trend charts
- State management: `Zustand` or React context for local UI state
- Simulation engine: `TypeScript service` or `Python FastAPI service`
- Backend API: `FastAPI` or `Node/Express/NestJS`
- Real-time data: WebSocket or Server-Sent Events
- Database: PostgreSQL for durable records; SQLite acceptable for local prototype
- Time-series option: TimescaleDB extension or InfluxDB if telemetry grows
- Authentication: Role-based access with secure password hashing or enterprise SSO placeholder
- Test framework: Vitest/Jest for front end, Pytest for Python services, Playwright for E2E
- CI/CD: GitHub Actions
- Deployment target: Cloudflare Pages, Vercel, Azure Static Web Apps, or containerized deployment

### 5.2 System Modules

Create the following modules:

```text
/src
  /app
    /routes
    /layout
    /theme
  /components
    /dashboard
    /controller
    /line
    /charts
    /alarms
    /qa
    /recipes
    /maintenance
    /process-safety
    /exposure
    /emergency
    /audit
  /simulation
    dosing-engine.ts
    line-state-machine.ts
    pump-model.ts
    valve-model.ts
    mixer-model.ts
    sensor-model.ts
    cpk-engine.ts
    alarm-engine.ts
    batch-engine.ts
    hazardous-material-engine.ts
    gas-vapor-engine.ts
    containment-engine.ts
    ventilation-engine.ts
    emergency-response-engine.ts
    lopa-engine.ts
    sif-engine.ts
  /data
    default-recipes.ts
    default-liquids.ts
    default-equipment.ts
    default-hazard-profiles.ts
    default-safety-functions.ts
    tag-schema.ts
  /api
    telemetry-api.ts
    batch-api.ts
    recipe-api.ts
    qa-api.ts
    audit-api.ts
  /tests
    unit
    integration
    e2e
/docs
  user-requirements.md
  functional-spec.md
  control-narrative.md
  validation-plan.md
  qa-qc-plan.md
  cybersecurity-plan.md
  process-safety-plan.md
  pha-hazop-register.md
  emergency-response-plan.md
  data-dictionary.md
  release-notes.md
```

---

## 6. Data Model

### 6.1 Liquid Entity

Each liquid shall include:

```ts
type Liquid = {
  id: 'A' | 'B' | 'C';
  name: string;
  lotNumber: string;
  density_g_per_ml: number;
  viscosity_cP: number;
  surfaceTension_mN_per_m: number;
  nominalDroplet_uL: number;
  targetDose_g: number;
  lowerSpecLimit_g: number;
  upperSpecLimit_g: number;
  accuracyRequirement_pct: 0.1;
  temperatureCompensationEnabled: boolean;
  calibrationCurveId: string;
  expirationDate?: string;
  materialCompatibilityNotes: string[];
  hazardProfileId: string;
  sdsId: string;
  safetyCritical: boolean;
  maxAllowableInventory_L?: number;
  containmentZoneId?: string;
};
```


### 6.2 Hazard Profile Entity

Each liquid and mixed product shall include a hazard profile. The model must allow the same liquid to be harmless in a demo scenario and highly hazardous in a validation scenario.

```ts
type HazardProfile = {
  materialId: 'A' | 'B' | 'C' | 'MIXED_PRODUCT';
  sdsId: string;
  sdsRevisionDate: string;
  ghsPictograms: Array<'flammable' | 'toxic' | 'corrosive' | 'health_hazard' | 'oxidizer' | 'explosive' | 'gas_cylinder' | 'environment' | 'irritant'>;
  signalWord: 'DANGER' | 'WARNING' | 'NONE';
  hazardStatements: string[];
  precautionaryStatements: string[];
  hazardClasses: Array<'TOXIC' | 'CORROSIVE' | 'FLAMMABLE' | 'COMBUSTIBLE' | 'REACTIVE' | 'OXIDIZER' | 'SENSITIZER' | 'ENVIRONMENTAL' | 'UNKNOWN'>;
  flashPoint_C?: number;
  boilingPoint_C?: number;
  vaporPressure_kPa?: number;
  lowerExplosiveLimit_pct?: number;
  upperExplosiveLimit_pct?: number;
  occupationalExposureLimit_ppm?: number;
  occupationalExposureLimit_mg_m3?: number;
  idlh_ppm?: number;
  pH?: number;
  incompatibleMaterials: string[];
  incompatibleLiquids: Array<'A' | 'B' | 'C'>;
  requiredPPE: PPERequirement[];
  storageClass: string;
  spillKitType: string;
  neutralizerRequired: boolean;
  drainDischargeProhibited: boolean;
  reportableQuantity_kg?: number;
  emergencyResponseGuideRef?: string;
  profileComplete: boolean;
  approvedBy?: string;
  approvedAt?: string;
};
```

### 6.3 PPE Requirement Entity

```ts
type PPERequirement = {
  ppeType: 'GLOVES' | 'FACE_SHIELD' | 'GOGGLES' | 'APR0N' | 'RESPIRATOR' | 'CHEMICAL_SUIT' | 'FRC' | 'HEARING' | 'OTHER';
  specification: string;
  requiredForModes: Array<'NORMAL_RUN' | 'CHANGEOVER' | 'CLEANING' | 'MAINTENANCE' | 'SPILL_RESPONSE' | 'EMERGENCY'>;
  verificationMethod: 'OPERATOR_CONFIRMATION' | 'BADGE_CHECK' | 'PERMIT_CHECK' | 'SIMULATION_ONLY';
};
```

### 6.4 Safety Instrumented Function Placeholder Entity

The application shall not claim to implement a real SIS. It shall model SIF placeholders so the dashboard, requirements, and validation package account for the required rigor.

```ts
type SafetyInstrumentedFunction = {
  sifId: string;
  name: string;
  hazardousEvent: string;
  initiatingCause: string;
  safeState: string;
  sensorTags: string[];
  logicSolverPlaceholder: string;
  finalElementTags: string[];
  tripSetpoint: number | string;
  tripDelay_ms?: number;
  voting?: '1oo1' | '1oo2' | '2oo3' | 'SIM_ONLY';
  silTargetPlaceholder: 'SIL_NOT_ASSESSED' | 'SIL_1' | 'SIL_2' | 'SIL_3' | 'SIL_4' | 'NOT_APPLICABLE';
  independentProtectionLayers: string[];
  proofTestInterval_days?: number;
  bypassAllowed: boolean;
  bypassApprovalRole?: 'EHS' | 'PROCESS_SAFETY' | 'CONTROLS' | 'ADMIN';
  validationTestIds: string[];
};
```

### 6.5 Containment and Detection Zone Entity

```ts
type ContainmentZone = {
  zoneId: string;
  zoneName: string;
  servedStations: string[];
  secondaryContainmentCapacity_L: number;
  largestSingleContainer_L: number;
  sumpLevel_pct: number;
  drainValveState: 'OPEN' | 'CLOSED' | 'LOCKED_CLOSED' | 'FAULT';
  leakDetectionEnabled: boolean;
  gasDetectionEnabled: boolean;
  ventilationEnabled: boolean;
  ventilationStatus: 'NORMAL' | 'REDUCED' | 'FAILED' | 'UNKNOWN';
  airChangesPerHour?: number;
  negativePressure_Pa?: number;
  classifiedAreaPlaceholder?: 'UNCLASSIFIED' | 'CLASS_I_DIV_1' | 'CLASS_I_DIV_2' | 'ZONE_0' | 'ZONE_1' | 'ZONE_2' | 'REVIEW_REQUIRED';
  spillMassEstimate_g: number;
  activeSafetyState: 'NORMAL' | 'WATCH' | 'ACTION' | 'TRIP' | 'EVACUATE';
};
```

### 6.6 Exposure / Gas-Vapor Reading Entity

```ts
type ExposureReading = {
  readingId: string;
  timestamp: string;
  zoneId: string;
  materialId: 'A' | 'B' | 'C' | 'MIXED_PRODUCT' | 'UNKNOWN';
  sensorType: 'LEL' | 'VOC' | 'TOXIC_GAS' | 'OXYGEN' | 'CORROSIVE_VAPOR' | 'PARTICULATE' | 'SIMULATED';
  value: number;
  unit: '%' | 'ppm' | 'mg/m3' | '%LEL' | '%O2';
  warningLimit: number;
  actionLimit: number;
  evacuationLimit: number;
  quality: 'GOOD' | 'UNCERTAIN' | 'BAD';
  alarmState: 'NORMAL' | 'WARNING' | 'ACTION' | 'EVACUATE' | 'FAULT';
};
```

### 6.7 Dosing Station Entity

```ts
type DosingStation = {
  id: string;
  liquidId: 'A' | 'B' | 'C';
  pumpType: 'peristaltic' | 'syringe' | 'piezo' | 'gear' | 'positive-displacement';
  valveType: 'needle' | 'pinch' | 'solenoid' | 'diaphragm' | 'rotary';
  nozzleId: string;
  nominalFlowRate_ml_min: number;
  minimumPulse_ms: number;
  valveClosureTime_ms: number;
  suckBackEnabled: boolean;
  suckBackPulse_ms: number;
  dripDetectionEnabled: boolean;
  pressureSensorEnabled: boolean;
  temperatureSensorEnabled: boolean;
  massVerificationEnabled: boolean;
  currentStatus: 'READY' | 'RUNNING' | 'HOLD' | 'FAULT' | 'MAINTENANCE' | 'LOCKED_OUT';
  containmentZoneId: string;
  localExhaustRequired: boolean;
  classifiedAreaReviewRequired: boolean;
  bondingGroundingRequired: boolean;
  safetyInstrumentedFunctionIds: string[];
};
```

### 6.8 Batch Record Entity

```ts
type BatchRecord = {
  batchId: string;
  recipeId: string;
  productCode: string;
  startTime: string;
  endTime?: string;
  operatorId: string;
  lineId: string;
  targetUnits: number;
  completedUnits: number;
  rejectedUnits: number;
  heldUnits: number;
  liquidLots: Record<'A' | 'B' | 'C', string>;
  doseResults: DoseResult[];
  alarms: AlarmEvent[];
  deviations: DeviationRecord[];
  signatures: ElectronicSignature[];
  finalDisposition: 'OPEN' | 'RELEASED' | 'REJECTED' | 'QA_HOLD';
};
```

### 6.9 Dose Result Entity

```ts
type DoseResult = {
  unitId: string;
  batchId: string;
  timestamp: string;
  liquidId: 'A' | 'B' | 'C';
  targetDose_g: number;
  actualDose_g: number;
  error_g: number;
  error_pct: number;
  dropletEquivalentCount: number;
  measuredTemperature_C: number;
  measuredPressure_kPa?: number;
  dispenseDuration_ms: number;
  valveCloseDelay_ms: number;
  estimatedLostDroplet_uL: number;
  dripDetected: boolean;
  passFail: 'PASS' | 'WARN' | 'FAIL';
  stationId: string;
  recipeStepId: string;
};
```

### 6.10 Controller Tag Entity

Create a PLC-like tag schema:

```ts
type ControllerTag = {
  tagName: string;
  addressAlias: string;
  dataType: 'BOOL' | 'INT' | 'DINT' | 'REAL' | 'STRING' | 'TIME' | 'DATE_TIME';
  value: unknown;
  quality: 'GOOD' | 'UNCERTAIN' | 'BAD';
  timestamp: string;
  access: 'READ_ONLY' | 'READ_WRITE' | 'ADMIN_ONLY';
  unit?: string;
  description: string;
  alarmLimits?: {
    lowLow?: number;
    low?: number;
    high?: number;
    highHigh?: number;
  };
};
```

---

## 7. Dosing Simulation Requirements

### 7.1 Simulation Modes

Provide these modes:

1. **Stable Production Mode**
   - Cpk defaults to 1.67.
   - Dose measurements remain centered with realistic random variation.

2. **Drift Mode**
   - Simulates pump wear, viscosity change, nozzle wetting, temperature shift, or calibration drift.
   - Cpk and bias trend downward over time.

3. **Fault Injection Mode**
   - User can inject a stuck valve, slow closure, air bubble, clogged nozzle, line pressure change, bad calibration curve, bad density value, scale drift, or sensor failure.

4. **Maintenance Recovery Mode**
   - Simulates recalibration, nozzle cleaning, pump replacement, valve replacement, purge, prime, and verification run.

5. **Recipe Changeover Mode**
   - Simulates purge, clean-in-place, lot change, new recipe loading, QA approval, and restart.


6. **Hazardous Leak / Spill Mode**
   - Simulates a fitting leak, pump seal failure, cracked tube, overfilled receiver, containment sump level increase, or small droplet aerosol release.
   - Requires active leak detection, containment accounting, operator alarm, simulated isolation, and incident record generation.

7. **Toxic Vapor / Exposure Mode**
   - Simulates vapor generation from the product, ventilation degradation, local exhaust failure, elevated gas/vapor readings, and personnel exposure warnings.
   - Triggers escalating warning/action/evacuation states based on configurable exposure limits.

8. **Flammable Atmosphere Mode**
   - Simulates vapor accumulation, LEL sensor readings, ignition-source interlock status, bonding/grounding status, and ventilation response.
   - Blocks operation above configured %LEL limits and records safety trips.

9. **Reactive / Incompatible Mixing Mode**
   - Simulates wrong-liquid addition, sequence error, incompatible liquid cross-connection, excessive temperature rise, pressure rise, or runaway-risk placeholder.
   - Triggers immediate hold/trip logic and requires EHS/process-safety review before reset.

10. **Emergency Shutdown Drill Mode**
   - Simulates E-stop, SIS trip placeholder, ventilation trip, fire alarm, gas alarm, containment breach, evacuation, and restart authorization workflow.

### 7.2 Dose Accuracy Model

For each liquid and each unit:

```text
Target Dose = recipe target
Tolerance = ±0.1% of target dose
LSL = target × (1 - 0.001)
USL = target × (1 + 0.001)
```

When Cpk is centered at 1.67:

```text
Cpk = min((USL - Mean) / (3σ), (Mean - LSL) / (3σ))
```

If the process is centered:

```text
σ = Tolerance / (3 × Cpk)
σ = (0.001 × Target Dose) / (3 × 1.67)
σ ≈ 0.0001996 × Target Dose
σ ≈ 0.01996% of Target Dose
```

The application shall calculate:

- Cp
- Cpk
- Pp
- Ppk
- Mean
- Median
- Standard deviation
- Bias from target
- % error
- Rolling 25-unit capability
- Rolling 100-unit capability
- Rolling 500-unit capability
- Batch-level capability
- By-liquid capability
- By-station capability
- Overall line capability

### 7.3 Capability Status Rules

Default status thresholds:

| Metric | Status | Meaning |
|---|---:|---|
| Cpk ≥ 1.67 | Excellent | Capable for high-precision production |
| 1.33 ≤ Cpk < 1.67 | Watch | Generally capable but trending risk exists |
| 1.00 ≤ Cpk < 1.33 | Action | Process may not reliably meet tight specs |
| Cpk < 1.00 | Critical | Process is not capable; trigger hold/reject logic |

### 7.4 Zero-Drip / No-Lost-Droplet Logic

The simulation shall model zero-drip control as a series of measurable conditions:

- Valve closure delay
- Residual nozzle pressure
- Liquid viscosity
- Nozzle wetting
- Suck-back timing
- Post-dose pressure decay
- Drip detection signal
- Vision or optical drip sensor placeholder
- Scale-based unexpected mass gain/loss
- Lost droplet equivalent calculation

Default reject logic:

```text
IF dripDetected = TRUE THEN
  mark unit as QA_HOLD or REJECT based on recipe rule
  increment lostDropletLedger
  create alarm event
  require operator acknowledgement
END IF

IF estimatedLostDroplet_uL > liquid.nominalDroplet_uL × allowedLostDropletFactor THEN
  create nonconformance
  divert unit
END IF
```

---

## 8. Line State Machine

Create a deterministic state machine with the following states:

```text
OFFLINE
INITIALIZING
IDLE
READY
BATCH_LOADING
PRECHECK
RUNNING
DOSING_A
VERIFY_A
MIX_STAGE_1
DOSING_B
VERIFY_B
MIX_STAGE_2
DOSING_C
VERIFY_C
FINAL_MIX
QA_DECISION
OUTFEED
HOLD
FAULT
E_STOP
SIS_TRIP
GAS_ALARM
LEL_ALARM
TOXIC_EXPOSURE_ALARM
CONTAINMENT_BREACH
VENTILATION_FAULT
FIRE_ALARM
EVACUATE
SPILL_RESPONSE
MAINTENANCE
CLEANING
CHANGEOVER
BATCH_COMPLETE
```

### 8.1 State Transition Requirements

- All state transitions shall be logged.
- Unsafe or invalid transitions shall be blocked.
- Recipe changes shall require line state `IDLE`, `READY`, `CHANGEOVER`, or `MAINTENANCE`.
- Batch release shall require QA role or configured electronic signature.
- Fault recovery shall require alarm acknowledgement and cause resolution.
- Emergency stop shall immediately freeze the simulation, mark actuators safe, and require reset workflow.

### 8.2 Interlock Examples

Include simulated interlocks:

- Container present before dose
- Correct recipe loaded
- Correct liquid lot loaded
- Liquid not expired
- Nozzle ready
- Pump primed
- Calibration current
- Scale/flowmeter online
- Mixer available
- Reject diverter healthy
- Guard closed
- E-stop healthy
- No high-high pressure
- No low-low tank level
- No communication loss
- No active critical alarm
- Hazard profile complete and approved
- SDS revision current
- Required PPE acknowledged for mode
- Local exhaust ventilation healthy
- Gas/vapor detectors online and below action limits
- LEL below configured warning/action limits, if flammable
- Oxygen level normal if inerting is enabled
- Secondary containment available and sump not high-high
- Drain valve locked closed during hazardous-material operation
- Bonding/grounding healthy if flammable/combustible
- Nitrogen/inerting healthy if required
- Fire suppression status healthy if required
- Eyewash/shower availability acknowledged if corrosive
- No incompatible-liquid connection detected
- No safety bypass active without approved permit
- No active permit conflict with run state

---

## 9. Expert Dashboard Requirements

Create a top-tier dashboard that feels like an expert HMI, SCADA, and quality analytics console combined.

### 9.1 Global Header

Display:

- Application name
- Environment: `Simulation`, `Validation`, `Production Replica`, or `Demo`
- Current line state
- Batch ID
- Recipe name/version
- Active user and role
- Date/time with timezone
- Overall equipment effectiveness summary
- Critical alarm count
- QA hold count
- Cpk summary

### 9.2 PLC-Style Controller Panel

Provide a panel analogous to a Siemens S7 controller readout:

- Controller mode: `RUN`, `STOP`, `HOLD`, `FAULT`, `MAINTENANCE`
- CPU health
- Scan cycle time, e.g. `8 ms`
- Min/average/max scan time
- Watchdog timer status
- Communication status
- Memory/load indicator
- I/O update time
- Program block status
- Simulated OB/FB/DB execution status
- Controller uptime
- Firmware placeholder
- Redundancy placeholder
- Time sync status
- Last download/configuration change

### 9.3 Controller Rack View

Render a visual rack with modules:

```text
[PS] [CPU] [DI] [DO] [AI] [AO] [Motion/Pump] [Comms] [Safety] [Spare]
```

Each module shall show:

- Green/yellow/red status
- Channel count
- Active fault count
- Last update time
- Hover details
- Click-through to diagnostics

### 9.4 Tag Monitor

Provide a searchable tag table:

- Tag name
- Address alias
- Data type
- Current value
- Engineering unit
- Quality
- Timestamp
- Access level
- Description
- Alarm limit, if applicable

Include tags such as:

```text
Line.State
Line.Speed_UPM
Line.EStopHealthy
Batch.ActiveId
Batch.RecipeId
Recipe.Version
DoseA.Target_g
DoseA.Actual_g
DoseA.Error_pct
DoseA.Cpk
DoseA.ValveOpen_ms
DoseA.DripDetected
DoseB.Target_g
DoseB.Actual_g
DoseB.Error_pct
DoseB.Cpk
DoseC.Target_g
DoseC.Actual_g
DoseC.Error_pct
DoseC.Cpk
Mixer.Speed_RPM
Mixer.Torque_Nm
Mixer.TimeRemaining_s
QA.HoldCount
QA.RejectCount
Controller.ScanTime_ms
Controller.Mode
Alarm.CriticalCount
```

### 9.5 Production Line Mimic

Create an animated process mimic showing:

- Infeed queue
- Carrier/container location
- Dosing station A
- Verification station A
- Mixer 1
- Dosing station B
- Verification station B
- Mixer 2
- Dosing station C
- Verification station C
- Final mixer
- QA hold lane
- Reject lane
- Outfeed lane

Each unit shall have a traceable `unitId`. Hovering over a unit shall show:

- Current stage
- Dose status for A/B/C
- Error percentage
- Drip flag
- QA disposition
- Time in stage
- Batch ID

### 9.6 Dosing Station Faceplates

Each dosing station shall have an HMI faceplate with:

- Station state
- Liquid name and lot
- Target dose
- Actual dose
- Error percentage
- Cpk
- Cp
- Rolling standard deviation
- Pump status
- Valve status
- Nozzle status
- Pressure
- Temperature
- Dispense duration
- Suck-back duration
- Drip detection
- Calibration due date
- Maintenance health
- Manual simulation controls, role-restricted

### 9.7 SPC and Capability Dashboard

Display:

- X-bar chart
- R chart or moving range chart
- Histogram with LSL/USL overlays
- Cp/Cpk trend
- Pp/Ppk trend
- Bias trend
- Sigma trend
- % error trend
- Liquid-by-liquid comparison
- Station-by-station comparison
- Rolling window selector: 25, 100, 500, batch, shift, day
- Rule violation detection:
  - Out of spec
  - Western Electric/Nelson-style trend placeholders
  - Bias drift
  - Increased variability
  - Cpk below action threshold

### 9.8 Recipe and Batch Dashboard

Show:

- Active recipe
- Recipe version
- Dose targets for A/B/C
- Allowed tolerances
- Mix times
- Line speed
- Hold/release criteria
- Approved-by metadata
- Batch start/end
- Units planned/completed/rejected/held
- Batch genealogy
- Liquid lot genealogy
- Changeover history
- Electronic signature placeholders

### 9.9 Alarm and Event Dashboard

Include an alarm table with:

- Timestamp
- Priority
- Area
- Equipment
- Alarm code
- Alarm text
- Active/cleared/acknowledged status
- Operator acknowledgement
- Duration
- Root cause category
- Corrective action note

Alarm classes:

- Critical safety
- Quality critical
- Process warning
- Maintenance warning
- Information
- Cybersecurity/system

### 9.10 Maintenance and Reliability Dashboard

Display:

- Pump run hours
- Pump cycles
- Valve cycles
- Nozzle clean count
- Calibration status
- PM due date
- Predicted failure risk
- Mean time between failures
- Mean time to repair
- Spare parts placeholder
- Maintenance log
- Fault history Pareto


### 9.11 Process Safety and Hazardous Material Dashboard

Create a dedicated high-rigor safety dashboard that sits beside the PLC-style controller panel and the quality dashboard. It shall be visible to operators, EHS, process safety, controls, QA, and administrators with role-appropriate detail.

Display:

- Overall process safety state: `NORMAL`, `WATCH`, `ACTION`, `TRIP`, `EVACUATE`
- Active hazardous-material flags by liquid and mixed product
- SDS/GHS card for Liquid A/B/C and mixed product
- GHS pictograms, signal word, hazard classes, and storage class
- Current inventory by material and containment zone
- Largest credible spill placeholder and secondary containment margin
- Sump level, drain isolation state, and leak detection state
- Ventilation status, airflow/ACH placeholder, local exhaust state, and negative pressure placeholder
- Gas/vapor readings with warning/action/evacuation thresholds
- LEL % for flammable scenarios
- Oxygen level if inerting is enabled
- Bonding/grounding state for flammable/combustible scenarios
- Fire detection/suppression placeholder state
- Eyewash/shower and spill-kit readiness placeholders
- Required PPE by line state and active task
- Active permits: hot work, line break, confined space, energized work, bypass, maintenance
- Safety bypasses, who approved them, expiry time, and affected interlocks
- Safety instrumented function placeholder states
- Proof-test due dates and overdue items
- Emergency response mode and muster/evacuation placeholder
- Last PHA/HAZOP review date and open recommendations
- MOC status for recipe, setpoint, equipment, and logic changes

Safety dashboard status rules:

```text
IF any evacuationLimit exceeded THEN state = EVACUATE
ELSE IF any SIF placeholder tripped THEN state = TRIP
ELSE IF containment breach active THEN state = TRIP
ELSE IF ventilation failed AND hazardous vapor risk active THEN state = ACTION
ELSE IF any gas reading above action limit THEN state = ACTION
ELSE IF any gas reading above warning limit THEN state = WATCH
ELSE state = NORMAL
```

### 9.12 Safety Instrumented Function / Interlock Matrix Dashboard

Show a matrix with one row per safety-critical function:

- SIF/interlock ID
- Hazardous event
- Initiating cause
- Sensor/input tags
- Logic condition
- Final element/safe action
- Safe state
- SIL target placeholder or “not assessed”
- Proof-test interval
- Last proof test
- Bypass allowed yes/no
- Current bypass state
- Validation test linked yes/no
- Last trip event
- Reset authorization role

Example rows:

| ID | Hazardous Event | Trigger | Safe Action | Reset Role |
|---|---|---|---|---|
| SIF-001 | Toxic vapor release | Gas sensor > evacuation limit | Stop dosing, close feed valves, raise evacuation state | EHS + Controls |
| SIF-002 | Flammable atmosphere | LEL > action limit | Stop dosing, isolate pumps, disable nonessential simulated ignition sources | Process Safety |
| SIF-003 | Overpressure | Pressure HH | Close inlet, stop pump, vent/relief placeholder, hold batch | Controls |
| INT-004 | Incompatible liquid | Wrong connection or wrong sequence | Block dosing, hold batch, create deviation | QA + Process Safety |
| INT-005 | Containment breach | Leak sensor or sump HH | Stop line, close drains, isolate feed, create incident | EHS |

### 9.13 Cybersecurity and Access Dashboard

Display:

- Active users
- Failed login attempts
- Role changes
- Configuration changes
- Recipe changes
- Audit trail health
- Backup status
- Security event log
- Session timeout status
- API token status placeholder
- Network zone placeholder

---

## 10. Analytics Requirements

### 10.1 Cpk Engine

Implement a reusable Cpk engine:

```ts
function calculateCpk(values: number[], lsl: number, usl: number) {
  const mean = average(values);
  const sigma = sampleStdDev(values);
  const cpu = (usl - mean) / (3 * sigma);
  const cpl = (mean - lsl) / (3 * sigma);
  return Math.min(cpu, cpl);
}
```

Edge cases:

- If `values.length < minimumSampleSize`, show `INSUFFICIENT DATA`.
- If `sigma = 0`, do not divide by zero; show special status.
- If all values are identical in simulation, inject realistic measurement noise or mark as invalid analytics.
- Always show sample size used for the calculation.

### 10.2 Dose Accuracy Engine

Calculate:

```text
error_g = actualDose_g - targetDose_g
error_pct = error_g / targetDose_g × 100
pass = LSL <= actualDose_g <= USL
```

### 10.3 Overall Line Quality Score

Create an overall quality score based on:

- Cpk by liquid
- Reject rate
- Hold rate
- Drip events
- Calibration health
- Alarm severity
- Equipment health
- Batch completeness
- Audit trail completeness

Default formula:

```text
Quality Score = 100
  - qualityCriticalAlarms × 10
  - processWarnings × 2
  - rejectRate_pct × 5
  - holdRate_pct × 2
  - dripEvents × 3
  - calibrationOverdueCount × 10
  - max(0, 1.67 - minCpk) × 25
```

Clamp result to 0–100.

### 10.4 OEE Approximation

Include OEE-style metrics:

```text
Availability = plannedRuntime - downtime / plannedRuntime
Performance = actualThroughput / idealThroughput
Quality = goodUnits / totalUnits
OEE = Availability × Performance × Quality
```

Show this as simulation-only unless real data is integrated later.

---


### 10.6 Process Safety Performance Score

Create a safety score separate from quality and OEE. A batch with excellent Cpk can still be unacceptable if safety performance is weak.

Default formula:

```text
Safety Score = 100
  - criticalSafetyAlarms × 15
  - evacuationEvents × 40
  - safetyTrips × 20
  - unauthorizedBypassEvents × 30
  - gasActionEvents × 15
  - gasWarningEvents × 5
  - containmentEvents × 20
  - ventilationFaultMinutes × 0.5
  - overdueProofTests × 10
  - openPHARecommendationsHigh × 10
  - mocOverdueItems × 5
```

Clamp result to 0–100 and display it separately from production performance. Do not allow high production output to mask poor safety performance.

### 10.7 Safety Leading Indicators

Track leading indicators:

- Near-miss count
- Safety-critical bypass count and duration
- Alarm flood count
- Ventilation degraded minutes
- Gas detector bad-quality minutes
- Proof tests overdue
- Preventive maintenance overdue on safety-critical equipment
- PHA/HAZOP recommendations open beyond due date
- MOC items awaiting approval
- Emergency drill completion status
- Safety training placeholder completion by role


## 11. Recipe Management

### 11.1 Recipe Structure

```ts
type Recipe = {
  id: string;
  name: string;
  version: string;
  status: 'DRAFT' | 'APPROVED' | 'OBSOLETE';
  productCode: string;
  liquidTargets: {
    A: DoseTarget;
    B: DoseTarget;
    C: DoseTarget;
  };
  mixStages: MixStage[];
  lineSpeed_unitsPerMinute: number;
  qaRules: QARule[];
  createdBy: string;
  approvedBy?: string;
  effectiveDate?: string;
  changeReason: string;
};
```

### 11.2 Recipe Controls

- Draft recipes may be edited by authorized process engineers.
- Approved recipes are locked.
- New versions require change reason and approval.
- Active batch must reference an immutable recipe version.
- Recipe parameter changes during a batch must create a deviation.
- Any recipe update shall appear in the audit trail.

---


### 11.6 Hazardous Recipe Safety Gate

A recipe shall not be approved for hazardous-material simulation unless the following are complete:

- Hazard profile linked for Liquid A, Liquid B, Liquid C, and mixed product.
- SDS revision and approval metadata present.
- Incompatibility matrix completed.
- Required PPE specified by operating mode.
- Ventilation, containment, gas detection, and fire-protection placeholders reviewed.
- Safety setpoints defined for pressure, temperature, vapor/gas, LEL, sump level, and dose limits.
- Alarm priorities rationalized for safety-critical alarms.
- Interlocks and SIF placeholders linked to validation tests.
- MOC review complete for new or changed recipes.
- PSSR checklist complete before first simulated production run.

Default recipe approval rule:

```text
IF recipe.hazardous = TRUE THEN
  require signatures from QA, Process Engineering, Controls, and EHS/Process Safety
END IF
```

### 11.7 Incompatibility Matrix

Include a matrix showing whether each liquid may contact each other liquid, cleaning agent, purge medium, seal material, tube material, pump wetted part, nozzle material, and containment liner.

Example:

| Pairing | Compatible? | Basis | Required Control |
|---|---:|---|---|
| Liquid A + Liquid B | Yes/No/Unknown | SDS / process knowledge | Block if unknown |
| Liquid A + Liquid C | Yes/No/Unknown | SDS / process knowledge | Block if unknown |
| Liquid B + Liquid C | Yes/No/Unknown | SDS / process knowledge | Block if unknown |
| Liquid A + cleaning solvent | Yes/No/Unknown | SDS / cleaning validation | Purge and verify |
| Mixed product + drain | Yes/No/Unknown | environmental review | Drain locked closed |

Unknown compatibility shall default to `BLOCKED`.


## 12. QA/QC Requirements for the Production Simulation

### 12.1 QA/QC Dashboard

Include panels for:

- Batch disposition
- Cpk compliance
- Dose accuracy by liquid
- Out-of-spec events
- Out-of-trend events
- Hold/reject ledger
- Deviation records
- CAPA records
- Calibration status
- Audit trail completeness
- Electronic signature status
- Data integrity checks

### 12.2 Quality Gates

Default quality gates:

1. Liquid lot verified
2. Recipe approved
3. Calibration current
4. Initial prime/purge complete
5. First-article verification passed
6. Cpk rolling value above configured threshold
7. No critical alarms active
8. No unresolved drip events
9. Batch record complete
10. QA release signature applied

### 12.3 Sampling Plan

Provide configurable sampling rules:

- First 10 units: 100% dose verification
- Stable run: every Nth unit or continuous virtual verification
- After alarm: next 10 units heightened verification
- After maintenance: first-article verification required
- After recipe change: first-article verification required
- After liquid lot change: first-article verification required

### 12.4 Deviation Management

A deviation record shall include:

- Deviation ID
- Batch ID
- Unit ID, if applicable
- Timestamp
- Affected liquid/station
- Event type
- Severity
- Immediate containment
- Root cause category
- Corrective action
- Preventive action
- Owner
- Due date
- QA disposition
- Approval signature placeholder

### 12.5 Data Integrity Rules

Apply ALCOA+ style principles:

- Attributable: every change has a user or system identity.
- Legible: records display clearly and export reliably.
- Contemporaneous: timestamps are created when events occur.
- Original: raw simulation data is preserved.
- Accurate: calculations are reproducible and unit-tested.
- Complete: all records required for batch disposition exist.
- Consistent: timestamps, units, and formulas are consistent.
- Enduring: records persist after reload.
- Available: records can be searched/exported by authorized users.

---

## 13. Application QA/QC and Validation Requirements

### 13.1 Required Developer Deliverables

Create and maintain:

- User requirements specification
- Functional specification
- Software design specification
- Data dictionary
- Control narrative
- Test plan
- Validation plan
- Cybersecurity plan
- QA/QC plan
- Release notes
- Traceability matrix
- Known limitations
- User guide

### 13.2 Test Strategy

Include automated tests for:

#### Unit Tests

- Cpk calculation
- Cp/Pp/Ppk calculation
- Dose accuracy calculation
- Tolerance limit calculation
- OEE calculation
- Quality score calculation
- State machine transitions
- Alarm rules
- Drip detection logic
- Recipe versioning
- Audit logging

#### Integration Tests

- Batch start to batch close
- Recipe load to dosing sequence
- Alarm creation to acknowledgement
- Fault injection to recovery
- Maintenance action to calibration reset
- QA hold to QA release
- WebSocket telemetry stream
- Database persistence

#### End-to-End Tests

- Operator starts a batch and monitors line
- Quality engineer reviews Cpk and releases batch
- Process engineer creates recipe revision
- Maintenance technician resolves simulated nozzle clog
- Admin reviews audit trail and user access

#### Performance Tests

- Sustain telemetry updates at target interval, e.g. 250 ms to 1 s.
- Render charts with at least 10,000 data points without UI failure.
- Keep dashboard interaction latency below 200 ms under nominal load.
- Validate batch history queries against large simulated datasets.

#### Security Tests

- Role-based access enforcement
- Authentication and session timeout
- Audit trail tamper resistance placeholder
- Input validation
- API authorization
- Dependency vulnerability scanning

### 13.3 Validation Package Structure

If used in a regulated or quality-critical context, structure validation as:

```text
URS  -> User Requirements Specification
FS   -> Functional Specification
DS   -> Design Specification
RTM  -> Requirements Traceability Matrix
IQ   -> Installation Qualification
OQ   -> Operational Qualification
PQ   -> Performance Qualification
VSR  -> Validation Summary Report
```


### 13.4 Process Safety Validation Requirements

Create validation tests specifically for hazardous-product behavior.

Required validation cases:

- Hazard profile incomplete blocks recipe approval.
- Missing SDS metadata blocks hazardous recipe release.
- Unknown compatibility blocks dosing.
- Wrong liquid lot or wrong connection triggers hold/trip.
- LEL warning/action/evacuation thresholds escalate correctly.
- Toxic vapor warning/action/evacuation thresholds escalate correctly.
- Ventilation failure stops or holds the line based on hazard mode.
- Containment sump high-high trips the line and locks drain discharge.
- Spill/leak detection creates incident record and batch hold.
- Fire alarm places the line into emergency state.
- E-stop and SIS-trip placeholders put all simulated actuators in safe state.
- Safety bypass requires authorized role, reason, expiry time, and audit record.
- Expired bypass automatically returns to safe state or blocks restart.
- Proof-test overdue creates safety warning and blocks production if configured critical.
- MOC-required change cannot be promoted without approval.
- PSSR checklist incomplete blocks first hazardous run.
- Emergency-response drill mode records response timeline.

Each safety validation case shall trace to:

- Hazard or HAZOP node
- Requirement ID
- Interlock or SIF placeholder ID
- Test ID
- Expected safe state
- Evidence artifact
- Approval status

### 13.5 Acceptance Criteria

The application is acceptable when:

- Three-liquid production line simulation runs end-to-end.
- Default Cpk starts at 1.67 for each liquid under stable mode.
- Default accuracy requirement is ±0.1%.
- Dosing A/B/C faceplates display target, actual, error, Cpk, and status.
- Production mimic shows unit movement through all stages.
- Alarms are generated, acknowledged, and logged.
- QA hold/release workflow works.
- Recipe versioning works.
- Batch records persist and export.
- Audit trail captures critical actions.
- Tests pass in CI.
- Dashboard remains readable on desktop and tablet.
- Documentation exists for setup, operation, validation, and limitations.

---

## 14. Cybersecurity Requirements

### 14.1 Minimum Security Controls

- Role-based access control
- Strong password or SSO placeholder
- Session timeout
- Least privilege
- Audit trail for critical actions
- Protected API routes
- Input validation
- Dependency scanning
- Secrets not stored in source code
- Secure default configuration
- Export logs without exposing secrets

### 14.2 OT/ICS Safety Boundary

The application shall include a prominent note:

> This system is a simulation, quality dashboard, and process-safety visualization tool. It is not a safety PLC, certified HMI, SIS, gas detection system, fire alarm panel, emergency shutdown system, or validated machine controller. Any real-equipment connection requires site-approved engineering, PHA/HAZOP, LOPA/SIL review where applicable, validation, cybersecurity, management of change, pre-startup safety review, and safety lifecycle controls.

### 14.3 Network Segmentation Placeholder

Represent future architecture layers:

```text
Level 4: Enterprise / ERP
Level 3: MES / Batch records / QA
Level 2: SCADA / HMI / Historian
Level 1: PLC / Controller / I/O
Level 0: Sensors / Pumps / Valves / Mixers
```

For the prototype, keep the web application disconnected from real Level 0/1 equipment.

---

## 15. Safety, Interlocks, and Risk Controls for Hazardous Product

Safety must be treated as a primary design domain equal to quality, production, and analytics. The application shall make unsafe conditions visible, deterministic, auditable, and hard to dismiss.

### 15.1 Simulation-Only Safety Boundary

The application shall prominently state:

> This application simulates hazardous-material dosing and process-safety logic. It does not provide certified protection for people, property, environment, or equipment. It is not a safety PLC, SIS, fire/gas system, gas detector, emergency shutdown system, or approved operating procedure.

No code generated from this specification may directly control hazardous equipment without formal engineering review, independent safety review, cybersecurity approval, validation, management of change, and site authorization.

### 15.2 Hierarchy of Controls Logic

Safety recommendations and dashboards shall follow the hierarchy of controls:

1. Eliminate the hazard where possible.
2. Substitute with a less hazardous material where possible.
3. Use engineering controls: containment, ventilation, isolation, automation, interlocks, gas detection, relief, fire protection.
4. Use administrative controls: procedures, permits, training, line clearance, MOC, PSSR, signage, access restrictions.
5. Use PPE as the final layer, never as the only control for a credible high-consequence event.

The app shall flag any safety strategy that relies only on PPE for a high-severity hazardous event.

### 15.3 Required Simulated Safety Controls

Include these controls at minimum:

- Emergency stop state
- SIS-trip placeholder state
- Emergency shutdown sequence placeholder
- Guard-door interlock placeholder
- Local exhaust / ventilation interlock
- Gas/vapor detector interlock
- LEL warning/action/evacuation thresholds
- Toxic exposure warning/action/evacuation thresholds
- Oxygen-deficiency/enrichment placeholder if inerting is enabled
- High-high pressure shutdown
- High-high temperature shutdown
- Low-low supply tank hold
- Overdose shutdown
- Underdose hold
- Drip detected hold/reject
- Leak detection hold/trip
- Secondary containment high-high trip
- Drain valve locked-closed interlock
- Mixer overload shutdown
- Flowmeter/mass scale communication fault
- Recipe mismatch hold
- Wrong liquid lot hold
- Incompatible liquid connection trip
- Calibration expired hold
- Proof-test overdue warning/block
- Unauthorized manual mode block
- Safety bypass permit control
- Hot-work/maintenance permit conflict block
- Fire alarm emergency state
- Emergency response mode
- Incident record creation

### 15.4 Hazard Review / PHA / HAZOP Register

Create a hazard register that can support PHA/HAZOP-like review. The register shall be exportable and linked to requirements, alarms, interlocks, validation tests, and residual risk.

| Hazard | Cause | Consequence | Detection | Safeguards | Required App Behavior | Residual Risk |
|---|---|---|---|---|---|---|
| Overdose | Pump calibration drift, wrong recipe, valve stuck open | Unsafe product, reaction, exposure, waste | Mass verification, Cpk trend, valve feedback | Dose limits, independent verification, QA hold | Hold/reject, alarm, deviation, require recalibration | Medium |
| Underdose | Air bubble, clogged nozzle, empty feed | Product out of spec or incomplete neutralization | Pressure trend, mass verification, flow anomaly | Prime/purge, low-level interlock | Hold, purge workflow, maintenance record | Medium |
| Drip after dose | Valve closure delay, nozzle wetting, pressure decay | Cross-contamination, exposure, wrong dose | Drip sensor, scale check, vision placeholder | Suck-back, shielded nozzle, containment | Hold/reject, lost-droplet ledger, alarm | Medium |
| Toxic vapor release | Leak, open vessel, ventilation failure | Worker exposure, evacuation | Gas/VOC detector, ventilation status | Enclosure, local exhaust, gas alarms, PPE | Stop dosing, isolate, action/evacuation workflow | High until engineered |
| Flammable atmosphere | Vapor buildup, failed ventilation, poor bonding | Fire/explosion | LEL detector, airflow, bonding check | Ventilation, grounding, classified electrical placeholder | Stop line, isolate, emergency alarm | High until engineered |
| Corrosive spill | Tube rupture, fitting leak, overfill | Chemical burn, equipment damage | Leak sensor, sump level, camera placeholder | Secondary containment, eyewash/shower, PPE | Stop line, close drains, spill response | Medium |
| Reactive incompatibility | Wrong liquid, wrong cleaning agent, sequence error | Heat, pressure, gas, rupture | Recipe/lot verification, temperature/pressure trend | Incompatibility matrix, connection verification | Block dosing, trip, incident record | High |
| Overpressure | Blocked nozzle, runaway, thermal expansion | Line rupture, release | Pressure transmitter HH | Relief placeholder, pump trip, isolation | Trip to safe state | High until reviewed |
| Static ignition | Poor bonding/grounding | Fire/explosion | Ground monitor placeholder | Bonding, grounding, humidity/static controls | Block flammable operation | Medium |
| Fire | Ignition of vapors or materials | Injury, property loss | Fire alarm placeholder | Fire protection, ESD, evacuation | Emergency state, stop/close/isolate | High |
| Cyber/config error | Unauthorized setpoint or safety bypass | Loss of control, unsafe operation | Audit trail, RBAC, anomaly detection | Least privilege, MOC, approval workflow | Block critical changes without approval | Medium |

### 15.5 HAZOP Nodes and Guidewords

At minimum, structure HAZOP-style records around these nodes:

- Feed tank A/B/C
- Transfer lines
- Dosing pumps
- Anti-drip valves/nozzles
- Verification scales/flowmeters
- Mixers
- Ventilation/enclosure
- Secondary containment/sump
- Waste/drain interface
- Cleaning/changeover system
- Control system/configuration
- Human interaction/manual mode

Guidewords:

```text
NO FLOW
MORE FLOW
LESS FLOW
REVERSE FLOW
WRONG MATERIAL
WRONG SEQUENCE
MORE PRESSURE
MORE TEMPERATURE
LESS VENTILATION
LOSS OF CONTAINMENT
STATIC/IGNITION SOURCE
MORE EXPOSURE
LESS MIXING
MORE RESIDENCE TIME
CONTAMINATION
CYBER/CONFIG CHANGE
```

Each HAZOP record shall include cause, consequence, existing safeguard, recommendation, owner, due date, status, and test linkage.

### 15.6 LOPA / Independent Protection Layer Placeholder

Include a LOPA-style view for high-consequence scenarios.

For each scenario, capture:

- Initiating event frequency placeholder
- Consequence severity
- Enabling conditions
- Existing safeguards
- Independent protection layers
- Conditional modifiers
- Required risk reduction placeholder
- SIF/SIL required? yes/no/not assessed
- Action owner
- Residual risk state

Do not allow the app to present LOPA/SIL numbers as valid engineering results unless clearly marked `PLACEHOLDER / NOT ENGINEERED`.

### 15.7 Safe State Definition

Define safe states by hazard type.

| Hazard Type | Safe State |
|---|---|
| Toxic release | Stop dosing, close feed valves, maintain/boost ventilation if safe, isolate source, alarm, evacuate if threshold exceeded |
| Flammable atmosphere | Stop dosing, close feed valves, disable nonessential simulated ignition sources, maintain explosion-safe ventilation placeholder, alarm |
| Corrosive spill | Stop dosing, close valves, close/lock drains, activate spill-response workflow, hold batch |
| Reactive event | Stop feeds, close valves, isolate, hold mixing per process-specific placeholder, alarm, require process-safety reset |
| Overpressure | Stop pump, close inlet, open relief/vent placeholder only if designed, alarm, hold batch |
| Fire alarm | Stop line, close feed valves, emergency state, evacuate, require authorized reset |
| Cyber compromise | Freeze unsafe commands, preserve audit logs, fail to safe simulation state, require admin/security review |

### 15.8 Alarm Priority and Operator Action Requirements

Every safety alarm shall include:

- Alarm priority
- Consequence if ignored
- Operator action
- Required response time
- Auto-action taken by the simulated controller
- Reset requirements
- Shelving allowed yes/no
- Suppression allowed yes/no
- Bypass allowed yes/no
- Audit requirement
- Linked procedure placeholder

Safety-critical alarms shall not be shelved or suppressed without an approved, time-limited permit.

### 15.9 Safety Bypass and Permit Control

Create a strict bypass model.

Required fields:

- Bypass ID
- Affected interlock/SIF placeholder
- Reason
- Start time
- Expiry time
- Approver
- Second approver if high consequence
- Compensating measure
- Active operator acknowledgement
- Automatic expiry behavior
- Audit record

Default behavior:

```text
IF bypass.expired = TRUE THEN
  remove bypass
  IF associated safety function still unhealthy THEN
    block restart
  END IF
END IF

IF bypass.affectsHighConsequenceScenario = TRUE THEN
  require EHS/process-safety approval
  require compensating measures
  require visible banner
END IF
```

### 15.10 Emergency Response Workflow

Provide emergency modes:

- Minor spill
- Major spill
- Toxic exposure
- Flammable vapor / LEL alarm
- Fire alarm
- Corrosive exposure
- Incompatible material event
- Medical emergency
- Evacuation
- Shelter-in-place

Each emergency workflow shall show:

- Immediate actions
- Safe-state actions already taken by simulation
- PPE placeholder
- Isolation points
- Spill kit / neutralizer placeholder
- Eyewash/shower placeholder
- Muster area placeholder
- Emergency contact placeholder
- External notification placeholder
- Incident timeline
- Post-incident hold/restart checklist

### 15.11 Pre-Startup Safety Review Checklist

Before a hazardous recipe can move to production-ready simulation status, require a PSSR checklist:

- Hazard profiles complete
- SDS current
- Incompatibility matrix complete
- Process limits documented
- Safety alarms rationalized
- Interlocks/SIF placeholders validated
- Ventilation/containment placeholders validated
- Gas detection placeholders validated
- Calibration current
- Proof tests current
- Emergency response plan reviewed
- Operators trained placeholder
- Maintenance procedures reviewed
- QA release criteria approved
- Cybersecurity and access controls reviewed
- MOC complete
- Open PHA recommendations reviewed for startup impact

### 15.12 Mechanical Integrity and Calibration Safety

Track safety-critical maintenance and calibration items:

- Pump seal integrity
- Tubing age and material compatibility
- Valve closure testing
- Nozzle cleaning and inspection
- Scale/flowmeter calibration
- Pressure transmitter calibration
- Temperature sensor calibration
- Gas/vapor detector calibration
- Ventilation performance check
- Containment inspection
- Drain isolation test
- Fire/gas system placeholder test
- E-stop and safety-trip proof test

Overdue safety-critical items shall affect the safety score and may block hazardous operation based on configuration.

### 15.13 Environmental Release Controls

The simulation shall include:

- Spill mass/volume ledger
- Lost droplet ledger
- Drain valve state
- Sump level and capacity
- Waste container capacity
- Waste compatibility placeholder
- Reportable quantity placeholder
- Environmental incident placeholder
- Batch impact and product disposition

Default rule:

```text
IF drainDischargeProhibited = TRUE AND drainValveState != LOCKED_CLOSED THEN
  block hazardous operation
END IF
```

### 15.14 Human Factors Requirements

Safety UX shall be designed for rapid comprehension under stress:

- Safety status must be visible above the fold.
- Do not rely on color alone.
- Use plain language for operator actions.
- Show the next safe action, not merely the fault code.
- Distinguish quality holds from life-safety trips.
- Prevent alarm floods from hiding evacuation-level alarms.
- Show active bypasses persistently.
- Require intentional acknowledgement for safety-critical reset.
- Preserve event sequence and do not overwrite alarm history.

## 16. UI/UX Requirements

### 16.1 General UX Principles

- Prioritize glanceable status.
- Show critical safety/quality information above fold.
- Use progressive disclosure: summary first, details on click.
- Avoid decorative complexity that obscures line state.
- Use consistent status language.
- Use color plus text/icon, never color alone.
- Preserve keyboard navigation.
- Support tablet use for operator dashboard.
- Provide dark industrial theme and high-contrast mode.
- Use a reusable design system with industrial-grade components, SVG process graphics, and role-specific layouts.
- Make every chart explain its sample size, unit, and time range.

### 16.2 Visual Status Conventions

Use consistent labels:

```text
GOOD
WATCH
ACTION
CRITICAL
FAULT
HELD
REJECTED
RELEASED
```

### 16.3 Dashboard Layout

Recommended main navigation:

1. Overview
2. Controller
3. Line Mimic
4. Dosing Stations
5. SPC / Cpk
6. Batch Records
7. Recipes
8. QA/QC
9. Alarms
10. Maintenance
11. Audit Trail
12. Settings

---

## 17. Export and Reporting

### 17.1 Required Exports

- Batch record PDF placeholder or HTML printable report
- CSV export of dose results
- CSV export of SPC data
- JSON export of batch data
- Alarm/event log export
- Audit trail export
- Validation traceability matrix export

### 17.2 Batch Report Contents

Each batch report shall include:

- Batch ID
- Product code
- Recipe name/version
- Liquid lots
- Operator
- Start/end time
- Units completed
- Units rejected
- Units held
- Dose target/actual/error summaries
- Cpk by liquid
- Overall quality score
- Alarms/deviations
- QA disposition
- Signatures placeholder

---

## 18. API Requirements

Implement API endpoints or service functions for:

```text
GET    /api/telemetry/current
GET    /api/telemetry/history
POST   /api/simulation/start
POST   /api/simulation/stop
POST   /api/simulation/reset
POST   /api/simulation/faults
GET    /api/batches
GET    /api/batches/:id
POST   /api/batches
PATCH  /api/batches/:id/disposition
GET    /api/recipes
POST   /api/recipes
PATCH  /api/recipes/:id
POST   /api/recipes/:id/approve
GET    /api/alarms
POST   /api/alarms/:id/acknowledge
GET    /api/qa/capability
GET    /api/qa/deviations
POST   /api/qa/deviations
GET    /api/audit
GET    /api/maintenance
POST   /api/maintenance/actions
```

---

## 19. Default Seed Data

Create seed data for:

### 19.1 Liquids

```text
Liquid A: Low-viscosity carrier liquid
Liquid B: Medium-viscosity active blend
Liquid C: High-sensitivity additive
```

### 19.2 Default Recipe

```text
Recipe: Precision Blend PB-001
Version: 1.0.0
Status: Approved
Liquid A target: 10.000 g ±0.1%
Liquid B target: 2.500 g ±0.1%
Liquid C target: 0.250 g ±0.1%
Line speed: 60 units/hour
Mix stage 1: 30 seconds
Mix stage 2: 45 seconds
Final mix: 90 seconds
Minimum Cpk release target: 1.67
Action Cpk threshold: 1.33
Critical Cpk threshold: 1.00
```

### 19.3 Equipment

```text
Station A: Positive-displacement pump + anti-drip valve
Station B: Syringe pump + needle valve + pressure monitor
Station C: Piezo microdispenser + optical drip detection
Mixer 1: Inline static mixer placeholder
Mixer 2: Agitated vessel placeholder
Final Mixer: High-precision controlled-speed mixer placeholder
Verification: Mass-based virtual scale after each dosing station
Reject: Servo diverter placeholder
```

---

## 20. Nightly QA/QC and Feature Update Automation

Create a nightly automation that runs at **0300 local project time**.

### 20.1 Purpose

The nightly job shall:

1. Run application QA/QC checks.
2. Validate simulation math.
3. Validate process-safety interlock logic, emergency states, and hazardous-material gates.
4. Check dashboard rendering, including the process-safety dashboard.
5. Rebuild documentation.
6. Review logs, test coverage, safety-bypass history, alarm performance, and open PHA/MOC placeholders.
7. Suggest or implement safe incremental improvements.
8. Open a pull request or update branch with changes.
9. Never weaken safety, quality, audit, cybersecurity, validation, PHA, MOC, emergency-response, or interlock controls without explicit human approval.

### 20.2 GitHub Actions Schedule

Create `.github/workflows/nightly-quality-and-feature-refresh.yml`:

```yaml
name: Nightly Quality and Feature Refresh

on:
  schedule:
    - cron: '0 8 * * *' # 0300 America/New_York during standard time; adjust for DST if needed
  workflow_dispatch:

jobs:
  nightly-checks:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run typecheck

      - name: Unit tests
        run: npm run test:unit

      - name: Integration tests
        run: npm run test:integration

      - name: E2E tests
        run: npm run test:e2e

      - name: Build
        run: npm run build

      - name: Generate validation report
        run: npm run validation:report

      - name: Run process safety validation tests
        run: npm run test:safety

      - name: Generate process safety report
        run: npm run safety:report

      - name: Dependency audit
        run: npm audit --audit-level=moderate

      - name: Visual regression tests
        run: npm run test:visual

      - name: Accessibility audit
        run: npm run test:a11y

      - name: UI performance audit
        run: npm run perf:ui

      - name: Capture UI screenshots
        run: npm run ui:screenshots

      - name: Create nightly improvement issue
        run: npm run nightly:improvement-review
```

### 20.3 Nightly Improvement Agent Prompt

Create a file named `.codex/nightly-improvement-prompt.md`:

```md
# Nightly Improvement Prompt

You are maintaining the Techniek PrecisionFlow web application.

Perform a disciplined nightly review:

1. Read the current test results, validation report, known limitations, and issue backlog.
2. Identify only safe, incremental improvements that preserve quality, cybersecurity, auditability, validation traceability, and deterministic simulation behavior.
3. Prioritize improvements in this order:
   - Failing tests or broken builds
   - Incorrect Cpk/SPC/math behavior
   - QA/QC or audit trail gaps
   - Process-safety, emergency-response, PHA/MOC, or safety-validation gaps
   - Accessibility and usability improvements
   - Performance improvements
   - Documentation improvements
   - Small dashboard enhancements
4. Do not change safety interlock logic, SIF placeholders, gas/vapor limits, emergency-state behavior, safety-bypass rules, QA release criteria, electronic signature behavior, or audit trail behavior unless a human-approved issue explicitly authorizes it.
5. If code changes are made, update tests and documentation in the same branch.
6. Produce a concise nightly report with:
   - What changed
   - Why it changed
   - Tests run
   - Residual risks
   - Safety impacts
   - Manual review required
7. Open a pull request. Do not automatically deploy to any environment that can affect real equipment.
```

### 20.4 Feature Candidate Backlog

The nightly agent may propose or implement small items such as:

- Add CUSUM or EWMA trend detection.
- Add nozzle health prediction.
- Improve tablet responsiveness.
- Add batch report export.
- Add alarm Pareto chart.
- Add calibration drift visualization.
- Add sample-size warnings to Cpk cards.
- Add keyboard navigation improvements.
- Add unit conversion tests.
- Add documentation diagrams.
- Add process-safety bowtie diagrams.
- Add alarm flood analysis for safety alarms.
- Add PHA recommendation aging chart.
- Add safety bypass duration report.
- Add emergency drill timeline report.

The nightly agent must not automatically implement:

- Real PLC connectivity
- Real pump/valve control
- Real gas detector integration
- Real fire/gas system integration
- Real safety PLC or SIS integration
- Real emergency shutdown control
- Automatic changes to safety setpoints, alarm priorities, SIF placeholders, or bypass rules
- Changed QA release thresholds
- Changed Cpk acceptance criteria
- Removed audit trail fields
- Disabled alarms
- Weakened role-based access
- Unreviewed dependency upgrades that alter core behavior

---

## 21. Definition of Done

The first complete version is done when:

- A user can run the app locally with one command.
- The overview dashboard displays live simulated production.
- The controller panel shows PLC-style state, scan time, tags, rack status, diagnostics, and alarms.
- The line mimic animates units through A/B/C dosing, verification, mixing, QA, and outfeed.
- The initial process uses Cpk = 1.67 and ±0.1% dose accuracy.
- SPC charts display live results.
- Cpk calculations are unit-tested.
- Zero-drip logic is simulated and visible.
- QA hold/reject/release workflow works.
- Recipe versioning works.
- Batch records persist and export.
- Audit trail captures operator, quality, recipe, alarm, and configuration events.
- Nightly QA/QC workflow exists.
- Documentation is complete enough for a new developer to understand the system.

---

## 22. Suggested First Build Sequence for Codex

1. Create app scaffold.
2. Add default data model and seed data.
3. Build simulation engine for one unit through all stages.
4. Add three-liquid dosing math and Cpk engine.
5. Add live telemetry store.
6. Build overview dashboard.
7. Build dosing station faceplates.
8. Build line mimic.
9. Build SPC/Cpk charts.
10. Build alarm engine.
11. Build recipe manager.
12. Build batch record page.
13. Build QA/QC page.
14. Build process-safety dashboard and hazardous-material gate logic.
15. Add HAZOP/LOPA/SIF placeholder records and validation tests.
16. Add emergency-response simulation workflows.
14. Build audit trail.
15. Add tests.
16. Add validation docs.
17. Add nightly workflow.
18. Polish UI and accessibility.

---

## 23. Non-Negotiable Constraints

- Keep the prototype disconnected from real equipment.
- Do not claim regulatory compliance; provide compliance-ready structure only.
- Do not use proprietary Siemens assets, names, graphics, or certification marks beyond descriptive references.
- Preserve auditability for all critical events.
- Never hide Cpk sample size.
- Never display Cpk without LSL, USL, mean, and sigma being recoverable.
- Never allow recipe edits during an active batch without deviation logging.
- Never allow failed QA gates to appear released.
- Never silently correct dose data.
- Never overwrite raw measurement data.
- Always distinguish simulated data from real production data.

---

## 24. README Starter Text

```md
# Techniek PrecisionFlow

A web-based digital twin and HMI-style dashboard for a simulated three-liquid precision dosing and mixing line.

The application models droplet-scale hazardous-material dosing, zero-drip control, PLC-style state monitoring, recipe execution, SPC/Cpk analytics, QA/QC gates, process-safety gates, hazardous-material dashboards, SIF/interlock placeholders, containment, ventilation, gas/vapor/exposure alarms, emergency response workflows, batch records, maintenance, audit trails, and nightly quality/safety checks.

Default process assumptions:

- Three liquids: A, B, C
- Dose accuracy: ±0.1%
- Initial centered Cpk: 1.67
- Mass-based verification
- Configurable droplet equivalent
- Simulated zero-drip control

This application is a simulation. It is not a certified PLC, safety controller, HMI, SCADA, MES, or validated production system.
```

---


---

## 25. Hazardous-Process Reference Links for Developer Research

Use official sources where possible. Do not copy proprietary standard text into the repository; capture only implementation requirements, traceability, and placeholders.

- OSHA 29 CFR 1910.119 Process Safety Management of Highly Hazardous Chemicals.
- EPA / eCFR 40 CFR Part 68 Chemical Accident Prevention Provisions.
- OSHA 29 CFR 1910.1200 Hazard Communication.
- NIST SP 800-82 Rev. 3 Guide to Operational Technology Security.
- ISA/IEC 61511 / ISA-84 functional safety for process-industry safety instrumented systems.
- ISA-18.2 alarm management concepts.
- NFPA 30 flammable and combustible liquids safeguards.
- NFPA 70 / NEC hazardous-classified location concepts.
- NIOSH hierarchy of controls.

## 26. Final Instruction to Codex

Build Techniek PrecisionFlow as a professional, maintainable, test-covered web application. Favor clear architecture, deterministic simulation, mathematically correct Cpk/SPC behavior, and industrial-grade dashboard clarity over decorative UI. The result should feel credible to a controls engineer, process engineer, quality engineer, and production manager.


---

## 27. Visual GUI, High-Performance HMI Graphics, and Operations Design Addendum

Adjust the application so it is not merely functional, but also visually attractive, highly legible, and aligned with modern industrial-operations software conventions. The result should feel like a polished hybrid of a high-performance HMI, a SCADA operations console, a manufacturing execution dashboard, and a quality analytics workbench.

### 27.1 Visual Design Objectives

The GUI shall be:

- **Industrial and credible** for controls engineers, operators, QA, EHS, and supervisors.
- **Visually attractive** without becoming decorative or distracting.
- **Grounded in industry standards** such as high-performance HMI thinking, alarm-management best practices, and recognizable process-graphics conventions.
- **Fast to read at a glance** during normal operations and emergencies.
- **Consistent across views** so operators do not need to relearn controls page to page.
- **Touch-friendly** for tablets and panel PCs while still feeling excellent on desktop.

The application should look closer to a premium industrial operations platform than to a generic business dashboard.

### 27.2 Applicable GUI and Graphics Conventions

Use the following conventions as design guidance:

- **ISA-101 high-performance HMI principles** for screen hierarchy, alarm visibility, and situational awareness.
- **ISA-18.2 alarm-management thinking** for alarm priority display and response workflows.
- **ISA-5.1 / P&ID-style symbology concepts** for process-equipment graphics and tag naming inspiration.
- **IEC 61131-3 / PLC-style mental models** for controller logic visibility.
- **SIMATIC S7-class visual expectations** as inspiration for operations credibility, but not as a direct clone of Siemens IP.

### 27.3 GUI Aesthetic Direction

The visual direction shall be a **clean industrial dark theme** with optional light mode, using neutral process graphics and restrained accent color.

#### 27.3.1 Dark Theme Default

Recommended color tokens:

- `bg.canvas = #0F1720`
- `bg.panel = #17212B`
- `bg.elevated = #1E2935`
- `border.subtle = #2A3947`
- `text.primary = #E6EDF3`
- `text.secondary = #A8B6C3`
- `text.muted = #7D8B99`
- `accent.info = #4EA1FF`
- `status.good = #3FB950`
- `status.watch = #F2CC60`
- `status.action = #FF9E44`
- `status.critical = #F85149`
- `status.held = #A371F7`
- `status.released = #3FB950`
- `status.rejected = #F85149`
- `status.manual = #58A6FF`
- `status.isolated = #8B949E`

#### 27.3.2 Light Theme Optional

Provide a light theme for conference/demo use, but ensure the dark theme remains the operational default.

#### 27.3.3 High-Performance HMI Color Rule

Use color intentionally:

- Normal equipment should mostly appear in grayscale or subdued tones.
- Color should emphasize **abnormal state**, **required action**, **running material flow**, **alarm severity**, and **safety condition**.
- Never flood the screen with saturated colors during normal operation.

### 27.4 Design System Requirements

Create a reusable design system inside the application.

#### 27.4.1 Core UI Components

Required components:

- App shell
- Left navigation rail
- Top operations status bar
- KPI card
- Alarm banner
- Faceplate modal/drawer
- Trend card
- Table/grid component
- Timeline/event strip
- Tag-value chip
- Equipment status badge
- Batch phase progress bar
- Safety permit badge
- Electronic-signature modal placeholder
- Split-pane detail view
- Full-screen operations mimic mode

#### 27.4.2 Typography

Use an industrially credible font stack such as:

- Primary UI font: `Inter`, `IBM Plex Sans`, or `Segoe UI`
- Numeric/technical font: `JetBrains Mono`, `IBM Plex Mono`, or `Consolas`

Typography rules:

- Large numeric readouts for target/actual/error/Cpk values
- Monospaced fonts for tags, timestamps, IDs, and controller diagnostics
- Tight heading hierarchy with clear visual separation
- Avoid ornamental fonts

#### 27.4.3 Spacing and Layout

Use an 8-point spacing system.

- Dense mode for operator screens
- Comfortable mode for QA/engineering review screens
- Minimum touch target size: 40 px, preferably 44 px on tablet
- Consistent card radius and border treatment
- Use subtle shadows sparingly; favor borders and contrast over heavy glow effects

### 27.5 Required Application Shell Layout

The GUI shall have a professional application shell with the following structure:

1. **Top status bar**
   - Line state
   - Batch ID
   - Recipe
   - Active alarms count
   - Safety state
   - Cpk snapshot
   - Current shift
   - Current user / role
   - Time / timezone

2. **Left navigation rail**
   - Overview
   - Operations Mimic
   - Controller
   - Dosing Stations
   - SPC / Cpk
   - Safety
   - Recipes
   - Batch Records
   - QA/QC
   - Alarms & Events
   - Maintenance
   - Audit Trail
   - Reports
   - Settings

3. **Main workspace**
   - Responsive grid with draggable/resizable widgets for authorized users
   - Preset layouts for Operator, QA, EHS, and Engineering roles

4. **Persistent bottom event strip**
   - Latest alarms/events
   - Controller communication status
   - Safety bypass indicator
   - Build/version info

### 27.6 Page-by-Page GUI Requirements

#### 27.6.1 Overview Page

The Overview page shall be the executive/operations landing screen.

Required layout:

- Row 1: KPI cards
  - OEE
  - Throughput
  - Current batch progress
  - Overall Cpk
  - Reject rate
  - Critical alarms
  - Safety readiness
- Row 2: wide process mimic spanning most of the page
- Row 3: live trend strip for dose error and line speed
- Right column or lower strip: alarm summary, QA holds, and maintenance advisories

This page should be attractive enough for demos and daily stand-ups while still serving operations.

#### 27.6.2 Operations Mimic Page

This shall be the flagship screen.

Requirements:

- Use **vector SVG graphics** for crisp scaling.
- Show pipelines, tanks, valves, pumps, nozzles, weighing/verification stations, mixers, ventilation status, gas detection zones, reject path, hold path, and outfeed.
- Animate material movement subtly using line flow glow, moving arrows, or pulsing segments.
- Show containers/carriers moving through the line with clear stage highlighting.
- Clicking any unit opens a right-side faceplate/drawer.
- Show permissives, interlocks, and active inhibits in context.
- Provide full-screen “control room mode”.

#### 27.6.3 Controller Page

Make this page resemble a premium PLC/HMI diagnostics screen.

Include:

- CPU health tile group
- Rack/module visualization
- Scan-time trend
- I/O quality map
- Network/communications health
- Active logic state / sequence step
- Tag watch list
- Program block status
- Download/change history

#### 27.6.4 Dosing Station Pages

Each station page shall provide a visually rich but uncluttered faceplate-centric layout.

Show:

- Large target vs actual gauge/readout
- Error percentage and tolerance band
- Rolling Cpk/Cp
- Pump speed / valve timing / pressure / temp
- Nozzle condition and drip detection
- Last calibration / next calibration due
- Small trend plots for the last 25 / 100 / 500 doses
- Station-specific alarms and maintenance notes

#### 27.6.5 Safety Page

The Safety page shall visually emphasize protective layers.

Show:

- Safety status summary tiles
- LEL / vapor / oxygen / exposure gauges, where applicable
- Ventilation and exhaust status
- Secondary containment and sump state
- Emergency stop chain health
- Safety bypasses and permits
- SIF placeholder cards with proof-test status
- Active evacuation / shelter / spill / fire states if triggered
- PHA / MOC / PSSR incomplete items as action cards

#### 27.6.6 SPC / Cpk Page

This page should look like a premium manufacturing analytics console.

Use:

- Large clean charts with minimal clutter
- Configurable date range and sample window
- Histogram + spec overlay
- X-bar / moving range
- Bias and drift trend
- Liquid/station comparison heatmap
- Capability summary table with conditional formatting
- Drill-through from summary to unit-level records

#### 27.6.7 Batch Record Page

Use a split-pane layout:

- Left pane: batch list / filters
- Right pane: selected batch timeline, recipe details, dose summary, QA events, alarms, operator actions, and signatures placeholder

### 27.7 Industry-Standard Process Graphics

The GUI shall use recognizable process-graphics conventions and a consistent symbol library.

#### 27.7.1 Required Symbol Library

Provide reusable SVG symbols for:

- Storage tank
- Day tank
- Pump
- Motor
- Control valve
- On/off valve
- Check valve
- Flow meter
- Pressure transmitter
- Temperature transmitter
- Load cell / scale
- Nozzle / dispense head
- Mixer / agitator
- Conveyor / indexing carrier
- Diverter gate
- Gas detector
- LEL detector
- Ventilation fan
- Exhaust hood
- Scrubber placeholder
- Containment berm / sump
- E-stop button
- Safety shower / eyewash marker

#### 27.7.2 Equipment State Conventions

Each symbol shall support visual states:

- Idle
- Running
- Starting
- Stopping
- Warning
- Faulted
- Isolated / locked out
- In manual
- In auto
- Bypassed
- Cleaning / CIP placeholder
- Maintenance

#### 27.7.3 Piping and Flow Conventions

- Use line thickness to distinguish major vs minor flow paths.
- Use directional arrows for material flow.
- Use separate style for ventilation/exhaust lines.
- Show closed valves clearly.
- Show blocked or isolated paths distinctly.
- Use legends and hover tips to avoid ambiguity.

### 27.8 Operational Workflows (“Ops”)

The GUI shall support industry-standard operational workflows, not just data display.

#### 27.8.1 Startup Workflow

Provide a guided startup sequence panel:

1. Verify utilities healthy
2. Verify hazard profile complete
3. Verify recipe approved
4. Verify tanks/levels sufficient
5. Verify safety permissives healthy
6. Verify no active critical alarms
7. Arm simulation / line ready
8. Start batch

Show blocked steps and the reason for each block.

#### 27.8.2 Batch Execution Workflow

Provide:

- Current phase
- Next phase
- Time remaining
- Operator prompt area
- Hold/resume control
- Contextual action checklist

#### 27.8.3 Alarm Response Workflow

Each alarm shall show:

- Severity
- What happened
- Likely cause
- Immediate safe action
- Allowed operator response
- Escalation path
- Whether batch must hold or abort

#### 27.8.4 Deviation / QA Workflow

Provide guided flows for:

- Place batch on hold
- Review dose excursion
- Assign deviation number
- Record immediate correction
- Route to QA review
- Release or reject decision

#### 27.8.5 Safety Event Workflow

For spills, releases, LEL alarms, toxic vapor alarms, or emergency trips, show an incident workflow ribbon with:

- Current emergency state
- Operator must-do steps
- Mustered/evacuated placeholder acknowledgement
- EHS contact placeholder
- Incident log shortcut
- Restart prerequisites

### 27.9 Interaction Patterns

- Clicking equipment opens a drawer instead of navigating away whenever possible.
- Use hover tooltips for tags and engineering units.
- Use sticky alarm banners for active critical conditions.
- Use pinned mini-trends in faceplates.
- Provide breadcrumb navigation for engineering workflows.
- Support keyboard shortcuts for common actions in simulation mode.
- Support a large-screen wallboard mode and a compact tablet mode.

### 27.10 Advanced Dashboard Features

Include the following features to elevate the GUI:

- Multi-screen operations layout presets
- Full-screen mimic mode for control-room display
- Historical playback / time scrubber for batch replay
- “What changed?” change-summary ribbon after configuration edits
- Compare two batches side-by-side
- Annotate trends with alarms and operator interventions
- Screenshot/export of current screen for investigations and reports
- Dark/light theme switching with persisted preference

### 27.11 Accessibility and Human Factors

In addition to general accessibility:

- Ensure every color-coded state has text and icon support.
- Maintain WCAG-compliant contrast in both dark and light themes.
- Ensure critical controls are separated to reduce mis-click risk.
- Require confirmation for stop/abort/reset/bypass actions.
- Ensure alarm acknowledgement is possible by keyboard and touch.
- Use plain language in safety and QA workflows.

### 27.12 Frontend Implementation Expectations

Implement the GUI with production-quality frontend practices.

Recommended frontend stack:

- `React`
- `TypeScript`
- `Tailwind CSS` or a comparable token-driven system
- `shadcn/ui` or a similarly clean component layer
- `Recharts`, `ECharts`, or `Plotly` for industrial analytics charts
- `SVG` for the process mimic and equipment graphics
- `Framer Motion` only for subtle, performance-safe motion if desired

Implementation requirements:

- Use a centralized design token file.
- Use reusable page templates and card patterns.
- Keep mimic graphics data-driven rather than hand-coded per page.
- Support role-based layouts.
- Support visual regression testing.
- Keep frame rates smooth on modern laptops and industrial panel PCs.

### 27.13 GUI-Specific QA/QC Requirements

Add the following QA/QC checks to the project:

- Visual regression tests for all primary pages
- Snapshot tests for symbol states and faceplates
- Accessibility scans for contrast and keyboard navigation
- Responsive tests for desktop, tablet, and large-screen modes
- Chart rendering tests under large datasets
- Alarm-banner persistence tests
- Full-screen mimic rendering tests
- Theme-switch persistence tests
- Performance tests for page load and live updates

### 27.14 Nightly GUI Improvement Automation

Expand the nightly 0300 automation to include GUI excellence checks.

Add these tasks:

1. Run visual regression tests against the approved baseline.
2. Capture fresh screenshots of:
   - Overview
   - Operations Mimic
   - Controller
   - Dosing Station A
   - Safety
   - SPC / Cpk
3. Run an accessibility audit.
4. Run a front-end performance audit.
5. Flag any UI drift that reduces readability, consistency, or safety clarity.
6. Suggest safe incremental GUI improvements such as spacing, chart clarity, or alarm-visibility improvements.
7. Never introduce purely cosmetic changes that reduce situational awareness.

Recommended additional package scripts:

```json
{
  "scripts": {
    "test:visual": "playwright test --grep @visual",
    "test:a11y": "playwright test --grep @a11y",
    "perf:ui": "lighthouse-ci autorun",
    "ui:screenshots": "node scripts/capture-ui-screenshots.js"
  }
}
```

### 27.15 GUI Acceptance Criteria

The GUI portion of the application is acceptable only if:

- It is immediately understandable to an experienced operator within minutes.
- It looks professional enough for an executive demonstration.
- It feels credible to a controls engineer and plant manager.
- Critical alarms and safety states are unmistakable.
- The process mimic is crisp, responsive, and scalable.
- Faceplates and trends are easy to read at a glance.
- The application remains attractive while preserving high-performance HMI discipline.
- The GUI supports real operational workflows rather than only showing metrics.

### 27.16 Developer Instruction

When implementing the next revision, prioritize a **visually polished industrial GUI** with **industry-standard graphics and operations workflows**. Do not stop at a generic dashboard. Build a design system, use vector process graphics, and make the application feel like a serious modern control-room application for a hazardous dosing and mixing line.


### 27.17 Required Companion Frontend Design-System and Wireframe Markdown

Codex shall create and maintain a second companion Markdown file named:

```text
docs/frontend-design-system-and-wireframes.md
```

This companion file is required. It is not optional documentation. It shall serve as the authoritative implementation guide for the visual interface, component system, screen structure, and operational workflows of the hazardous dosing-line GUI.

#### 27.17.1 Companion File Purpose

The companion file shall translate this master application specification into a screen-by-screen frontend design plan that a developer, designer, or Figma workflow can execute directly.

It shall include:

- Design philosophy
- Visual identity
- Design tokens
- Component inventory
- Page-by-page wireframes
- Process mimic layout
- Equipment symbol library
- Faceplate specifications
- Alarm and safety interaction patterns
- Responsive behavior
- Accessibility requirements
- GUI QA/QC checks
- Figma handoff instructions
- Implementation checklist

#### 27.17.2 Required Companion File Outline

Codex shall generate the companion file using this exact outline as the minimum structure:

```md
# Techniek PrecisionFlow Frontend Design System and Wireframes

## 1. Purpose and Scope
## 2. Design Philosophy
## 3. Operator Mental Model
## 4. Visual Identity
## 5. Theme Tokens
## 6. Typography Tokens
## 7. Spacing, Radius, Border, and Elevation Tokens
## 8. Status, Alarm, and Safety Color Rules
## 9. Iconography and Symbol Rules
## 10. Application Shell Wireframe
## 11. Navigation Model
## 12. Overview Page Wireframe
## 13. Operations Mimic Page Wireframe
## 14. Controller Diagnostics Page Wireframe
## 15. Dosing Station Faceplate Wireframes
## 16. Safety Dashboard Wireframe
## 17. SPC / Cpk Analytics Wireframe
## 18. Batch Records Wireframe
## 19. QA/QC Workflow Wireframes
## 20. Alarms and Events Wireframe
## 21. Maintenance Wireframe
## 22. Audit Trail Wireframe
## 23. Reports Wireframe
## 24. Responsive Layouts
## 25. Wallboard Mode
## 26. Tablet Mode
## 27. Accessibility and Human Factors
## 28. Figma Handoff Instructions
## 29. React Component Mapping
## 30. GUI QA/QC and Visual Regression Tests
## 31. Nightly GUI Review Instructions
## 32. Acceptance Criteria
```

#### 27.17.3 Wireframe Format Requirements

Each page wireframe section shall include:

- Page purpose
- Primary user roles
- Critical information above the fold
- Layout grid
- Required cards/panels
- Required charts/tables
- Required controls
- Safety-critical states
- Alarm behavior
- Empty/loading/error states
- Desktop layout
- Tablet layout
- Wallboard layout, where applicable
- Implementation notes

Use simple ASCII or Markdown block wireframes before code implementation. Example:

```text
+--------------------------------------------------------------------------------+
| Top Status Bar: LINE RUNNING | Batch | Recipe | Cpk | Safety | Alarms | User  |
+-----------+--------------------------------------------------------------------+
| Nav Rail  | KPI Row: OEE | Throughput | Cpk | Rejects | Safety Ready          |
|           +--------------------------------------------------------------------+
|           | Process Mimic: Tanks -> Dose A -> Mix -> Dose B -> Mix -> Dose C   |
|           +--------------------------------------------------------------------+
|           | Trend Strip: Dose Error, Cpk, Line Speed, Alarm Events             |
+-----------+--------------------------------------------------------------------+
```

#### 27.17.4 Design Token Requirements

The companion file shall include token tables for:

- Color
- Typography
- Spacing
- Radius
- Border
- Shadow/elevation
- Motion
- Z-index/layering
- Status state
- Alarm severity
- Equipment state
- Chart palette

Tokens shall be implementation-ready for Tailwind, CSS variables, or a TypeScript token object.

#### 27.17.5 Component Specification Requirements

For every reusable GUI component, the companion file shall define:

- Component name
- Purpose
- Props/data inputs
- Visual states
- Safety states
- Accessibility notes
- Test requirements
- Example usage

Required components include at minimum:

- `AppShell`
- `TopStatusBar`
- `NavigationRail`
- `AlarmBanner`
- `KpiCard`
- `ProcessMimic`
- `EquipmentSymbol`
- `ValveSymbol`
- `PumpSymbol`
- `TankSymbol`
- `MixerSymbol`
- `GasDetectorSymbol`
- `DosingFaceplate`
- `ControllerRack`
- `TagMonitor`
- `TrendCard`
- `CapabilityChart`
- `BatchTimeline`
- `SafetyPermitBadge`
- `EmergencyWorkflowRibbon`
- `ElectronicSignatureModal`

#### 27.17.6 Figma Handoff Instructions

The companion file shall include a Figma-ready section instructing a designer or Figma-capable agent to create:

1. A design-system page
2. A color/token page
3. A component library page
4. An operations mimic page
5. A desktop screen set
6. A tablet screen set
7. A wallboard screen set
8. A safety-state and alarm-state page
9. A wireflow page showing startup, batch execution, alarm response, QA hold/release, and emergency response

Figma frames shall use these recommended sizes:

- Desktop operations screen: `1440 x 1024`
- Large control-room screen: `1920 x 1080`
- Tablet: `1024 x 768`
- Mobile review-only view, if implemented: `390 x 844`

The Figma handoff shall explicitly require editable layers, named components, reusable variants, design tokens, and component-to-code traceability.

#### 27.17.7 React Implementation Mapping

The companion file shall map wireframes to React route/page components.

Example:

```text
/overview               -> OverviewPage.tsx
/mimic                  -> OperationsMimicPage.tsx
/controller             -> ControllerDiagnosticsPage.tsx
/dosing/:stationId      -> DosingStationPage.tsx
/safety                 -> SafetyDashboardPage.tsx
/spc                    -> CapabilityAnalyticsPage.tsx
/batches                -> BatchRecordsPage.tsx
/qa                     -> QaQcPage.tsx
/alarms                 -> AlarmsEventsPage.tsx
/maintenance            -> MaintenancePage.tsx
/audit                  -> AuditTrailPage.tsx
/reports                -> ReportsPage.tsx
```

#### 27.17.8 Nightly Synchronization Requirement

The nightly 0300 automation shall check whether the companion frontend design-system/wireframe file is current.

The nightly job shall:

1. Compare implemented routes/components against `docs/frontend-design-system-and-wireframes.md`.
2. Flag missing components, missing states, or stale wireframes.
3. Update screenshots or notes when the GUI changes.
4. Run visual regression and accessibility tests.
5. Add a dated changelog entry to the companion file when design guidance changes.
6. Never remove safety, alarm, QA, audit, or accessibility requirements without explicit human approval.

Add this package script placeholder:

```json
{
  "scripts": {
    "docs:ui-sync-check": "node scripts/check-ui-doc-sync.js"
  }
}
```

Add this step to the nightly workflow:

```yaml
      - name: Check UI design-system documentation sync
        run: npm run docs:ui-sync-check
```

#### 27.17.9 Acceptance Criteria for the Companion File

The companion Markdown file is acceptable only if:

- A developer can build the GUI without guessing the layout.
- A designer can create matching Figma screens without asking for additional structure.
- Each major route has a wireframe.
- Each critical equipment state has a visual rule.
- Safety and alarm states are handled with more rigor than normal production states.
- The file includes desktop, tablet, and wallboard behavior.
- It includes GUI test expectations.
- It remains synchronized with implementation through nightly checks.

#### 27.17.10 Codex Instruction

Before building the frontend, Codex shall create `docs/frontend-design-system-and-wireframes.md` from this section and Section 27. Codex shall then implement the GUI against that companion file. If a design or implementation decision conflicts with this master specification, the master hazardous-product specification governs. If the companion file adds more specific GUI detail without weakening safety, quality, auditability, or validation controls, the companion file governs frontend implementation.
