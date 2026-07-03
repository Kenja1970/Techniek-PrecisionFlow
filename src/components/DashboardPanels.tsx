import { formatTagValue, tagGroup, tagUnit } from "../data/tag-schema";
import type { ControllerTag, SimulationSnapshot } from "../simulation/types";

interface Props {
  snapshot: SimulationSnapshot;
}

function TagRow({ tag }: { tag: ControllerTag }) {
  const unit = tagUnit(tag.name);
  const formatted = formatTagValue(tag);

  return (
    <tr>
      <td className="pf-tag-name">{tag.name}</td>
      <td className="pf-tag-value-cell">
        <span className="pf-tag-value">{formatted}</span>
        {unit ? <span className="pf-tag-unit">{unit}</span> : null}
      </td>
      <td className="pf-tag-type">{tag.type}</td>
    </tr>
  );
}

export function TagMonitor({ snapshot }: Props) {
  const groups = new Map<string, ControllerTag[]>();
  for (const tag of snapshot.tags) {
    const g = tagGroup(tag.name);
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(tag);
  }

  return (
    <div className="pf-tag-monitor">
      {[...groups.entries()].map(([group, tags]) => (
        <div key={group} className="pf-tag-group">
          <div className="pf-tag-group-header">{group}</div>
          <table className="pf-tag-table">
            <thead>
              <tr>
                <th>Tag</th>
                <th>Value</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((t) => (
                <TagRow key={t.name} tag={t} />
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export function ControllerPanel({ snapshot }: Props) {
  return (
    <dl className="pf-batch">
      <dt>Controller</dt>
      <dd>
        PF-PLC-01 <span className="pf-inline-unit">{snapshot.running ? "RUN" : "STOP"}</span>
      </dd>
      <dt>Scan count</dt>
      <dd>
        {snapshot.scanCount} <span className="pf-inline-unit">scans</span>
      </dd>
      <dt>Active phase</dt>
      <dd>{snapshot.phase}</dd>
      <dt>Recipe</dt>
      <dd>{snapshot.recipe.name}</dd>
    </dl>
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
        {snapshot.actual.A.toFixed(3)}{" "}
        <span className="pf-inline-unit">g</span> / {snapshot.recipe.targets.A}{" "}
        <span className="pf-inline-unit">g target</span>
      </dd>
      <dt>Liquid B</dt>
      <dd>
        {snapshot.actual.B.toFixed(3)}{" "}
        <span className="pf-inline-unit">g</span> / {snapshot.recipe.targets.B}{" "}
        <span className="pf-inline-unit">g target</span>
      </dd>
      <dt>Liquid C</dt>
      <dd>
        {snapshot.actual.C.toFixed(3)}{" "}
        <span className="pf-inline-unit">g</span> / {snapshot.recipe.targets.C}{" "}
        <span className="pf-inline-unit">g target</span>
      </dd>
      <dt>Preheat energy</dt>
      <dd>
        A {snapshot.preheat.energyWh.A.toFixed(2)}{" "}
        <span className="pf-inline-unit">Wh</span> · C{" "}
        {snapshot.preheat.energyWh.C.toFixed(2)} <span className="pf-inline-unit">Wh</span>
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
