import type { Run, RunStatus } from "./run.types";

export const SIMULATED_MS = 6000;

export const STATUS_LABEL: Record<RunStatus, string> = {
  queued: "En cola",
  running: "En curso",
  completed: "Completada",
  failed: "Fallida",
  cancelled: "Cancelada",
};

export const STATUS_COLOR: Record<RunStatus, string> = {
  queued: "text-ra-blue",
  running: "text-ra-acc",
  completed: "text-ra-teal",
  failed: "text-ra-red",
  cancelled: "text-ra-mut",
};

export function advance(run: Run, now: number): Run {
  if (run.status !== "running" || !run.startedAt) return run;
  const fraction = Math.min(1, (now - run.startedAt) / SIMULATED_MS);
  const generation = Math.floor(fraction * run.generations);
  return { ...run, generation, status: fraction >= 1 ? "completed" : "running" };
}

export const progressOf = (run: Run) =>
  run.status === "completed" ? 100 : Math.round((run.generation / run.generations) * 90);

export const isFinished = (run: Run) => run.status !== "running" && run.status !== "queued";
