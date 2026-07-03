import type { SimulationSnapshot } from "../simulation/types";

interface Props {
  snapshot: SimulationSnapshot;
}

export function SafetyBanner({ snapshot }: Props) {
  const hazardOk =
    snapshot.recipe.hazardProfileComplete && snapshot.interlocks.every((i) => i.pass);

  return (
    <div className={`pf-banner ${hazardOk ? "ok" : "alert"}`}>
      {hazardOk
        ? "Hazard profile complete · interlocks healthy · simulation-only digital twin"
        : "Process safety incomplete — recipe approval and batch release blocked until hazard profile is complete."}
    </div>
  );
}
