import type { Assignment } from "@/features/runs/services/run.types";

export function fleetSummary(fleet: Assignment[]) {
  const groups = new Map<string, number>();
  fleet.forEach(({ drone, camera }) => {
    const label = `${drone} con ${camera}`;
    groups.set(label, (groups.get(label) ?? 0) + 1);
  });
  return [...groups].map(([label, count]) => ({ label, count }));
}
