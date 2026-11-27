import { delay } from "@/shared/lib/delay";
import { createStore } from "@/shared/lib/store";
import { RUNS } from "../data/runs.seed";
import { advance } from "./run.rules";
import type { Run } from "./run.types";

const store = createStore<Run[]>("ra.runs", RUNS);

function current() {
  const now = Date.now();
  const runs = store.read().map((run) => advance(run, now));
  store.write(runs);
  return runs;
}

export function peekRun(id: string) {
  return current().find((run) => run.id === id);
}

export async function listRuns() {
  await delay();
  return current();
}

export async function getRun(id: string) {
  await delay();
  const run = peekRun(id);
  if (!run) throw new Error("La corrida no existe");
  return run;
}

export async function createRun(input: Omit<Run, "id" | "status" | "generation" | "startedAt">) {
  await delay(700);
  const runs = store.read();
  const id = String(Math.max(0, ...runs.map((run) => Number(run.id))) + 1);
  store.write([{ ...input, id, status: "running", generation: 0, startedAt: Date.now() }, ...runs]);
  return id;
}

export async function cancelRun(id: string) {
  await delay(500);
  store.write(current().map((run) => (run.id === id && run.status === "running" ? { ...run, status: "cancelled", startedAt: undefined } : run)));
}

export async function deleteRun(id: string) {
  await delay(400);
  store.write(store.read().filter((run) => run.id !== id));
}
