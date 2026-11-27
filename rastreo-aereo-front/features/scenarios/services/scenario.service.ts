import { delay } from "@/shared/lib/delay";
import { createStore, newId } from "@/shared/lib/store";
import type { Scenario, ScenarioConfig } from "@/shared/types/domain";
import { TEMPLATES } from "../data/templates";

const saved = createStore<Scenario[]>("ra.scenarios", []);
const selected = createStore<string>("ra.selectedScenario", TEMPLATES[0].id);

const all = () => [...TEMPLATES, ...saved.read()];

export const selectScenario = (id: string) => selected.write(id);

export async function listScenarios() {
  await delay();
  return all();
}

export async function getScenario(id: string) {
  await delay();
  const found = all().find((item) => item.id === id);
  if (!found) throw new Error("El escenario no existe");
  return found;
}

export async function getSelectedScenario() {
  await delay();
  return all().find((item) => item.id === selected.read()) ?? TEMPLATES[0];
}

export async function saveScenario(input: { id?: string; name: string; config: ScenarioConfig }) {
  await delay(500);
  const others = saved.read().filter((item) => item.id !== input.id);
  const own = saved.read().find((item) => item.id === input.id);
  const duplicated = all().some((item) => item.id !== own?.id && item.name.toLowerCase() === input.name.toLowerCase());
  if (duplicated) throw new Error("Ya existe un escenario con ese nombre");
  const scenario: Scenario = { id: own?.id ?? newId(), name: input.name, isTemplate: false, config: input.config };
  saved.write([...others, scenario]);
  return scenario;
}

export async function deleteScenario(id: string) {
  await delay(400);
  saved.write(saved.read().filter((item) => item.id !== id));
  if (selected.read() === id) selected.write(TEMPLATES[0].id);
}
