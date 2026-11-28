import type { ScenarioConfig } from "@/shared/types/domain";

export type RunStatus = "queued" | "running" | "completed" | "failed" | "cancelled";

export type Assignment = { drone: string; camera: string };

export type Run = {
  id: string;
  scenarioName: string;
  scenario: ScenarioConfig;
  status: RunStatus;
  drones: number;
  fleet?: Assignment[];
  points: number;
  population: number;
  generations: number;
  seed: number;
  generation: number;
  startedAt?: number;
  error?: string;
};
