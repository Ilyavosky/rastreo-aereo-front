import type { ScenarioConfig } from "@/shared/types/domain";

export type RunStatus = "queued" | "running" | "completed" | "failed" | "cancelled";

export type Run = {
  id: string;
  scenarioName: string;
  scenario: ScenarioConfig;
  status: RunStatus;
  drones: number;
  points: number;
  population: number;
  generations: number;
  seed: number;
  generation: number;
  startedAt?: number;
  error?: string;
};
