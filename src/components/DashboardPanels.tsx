import type { SimulationSnapshot } from "../simulation/types";

interface Props {
  snapshot: SimulationSnapshot;
}

export function ControllerPanel({ snapshot }: Props) {
  return (
    <dl className="pf-batch">
      <dt>Controller</dt>
      <dd>PF-PLC-01 RUN {snapshot.running ? "TRUE" : "FALSE"}</dd>
      <dt>Scan count</dt>
      <dd>{snapshot.scanCount}</dd>
      <dt>Active phase</dt>
      <dd>{snapshot.phase}</dd>
      <dt>Recipe</dt>
      <dd>{snapshot.recipe.name}</dd>
    </dl>
  );
}

export function TagMonitor({ snapshot }: Props) {
  return (
    <table className="pf-tag-table">
      <thead>
        <tr>
          <th>Tag</th>
          <th>Value</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        {snapshot.tags.map((t) => (
          <tr key={t.name}>
            <td>{t.name}</td>
            <td className="num">{String(t.value)}</td>
            <td>{t.type}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function AlarmBuffer({ snapshot }: Props) {
  return (
    <table className="pf-alarm-table">
      <thead>
        <tr>
          <th>Time</th>
          <th>Pri</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        {snapshot.alarms.length ? (
          snapshot.alarms.map((a, i) => (
            <tr key={`${a.time}-${i}`}>
              <td>{a.time.slice(11, 19)}</td>
              <td className={a.priority === "HIGH" ? "pf-alarm-high" : "pf-alarm-med"}>
                {a.priority}
              </td>
              <td>{a.message}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3}>No active alarms</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export function InterlockList({ snapshot }: Props) {
  return (
    <ul className="pf-interlocks">
      {snapshot.interlocks.map((i) => (
        <li key={i.id} className={i.pass ? "pass" : "fail"}>
          {i.label}
        </li>
      ))}
    </ul>
  );
}

export function BatchRecord({ snapshot }: Props) {
  return (
    <dl className="pf-batch">
      <dt>Batch ID</dt>
      <dd>{snapshot.batchId}</dd>
      <dt>Liquid A</dt>
      <dd>
        {snapshot.actual.A.toFixed(3)} g (target {snapshot.recipe.targets.A} g)
      </dd>
      <dt>Liquid B</dt>
      <dd>
        {snapshot.actual.B.toFixed(3)} g (target {snapshot.recipe.targets.B} g)
      </dd>
      <dt>Liquid C</dt>
      <dd>
        {snapshot.actual.C.toFixed(3)} g (target {snapshot.recipe.targets.C} g)
      </dd>
      <dt>Release status</dt>
      <dd>
        {snapshot.phase === "complete" || snapshot.phase === "idle"
          ? "See QA alarms"
          : "In process"}
      </dd>
    </dl>
  );
}
