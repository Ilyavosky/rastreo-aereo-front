import { TEMPLATES } from "@/features/scenarios/data/templates";
import type { Run } from "../services/run.types";

const base = { drones: 3, points: 8, population: 60, generations: 40, seed: 11 };
const [coyota, navidad, presa] = TEMPLATES;

export const RUNS: Run[] = [
  { ...base, id: "4", scenarioName: coyota.name, scenario: coyota.config, status: "running", generation: 26 },
  { ...base, id: "3", scenarioName: coyota.name, scenario: coyota.config, status: "completed", generation: 40 },
  { ...base, id: "2", scenarioName: navidad.name, scenario: navidad.config, status: "cancelled", population: 100, generations: 100, generation: 12 },
  { ...base, id: "1", scenarioName: presa.name, scenario: presa.config, status: "failed", population: 100, generations: 100, generation: 0, error: "Error de ejemplo: el proceso de optimización se interrumpió." },
];
