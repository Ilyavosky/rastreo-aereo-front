import type { Scenario, ScenarioConfig } from "@/shared/types/domain";
import { SUMIDERO } from "./sumidero";

export const emptyConfig = (): ScenarioConfig => ({
  widthM: 1000,
  heightM: 1000,
  cellM: 20,
  vegetationDefault: "open",
  vegetationZones: [],
  forbiddenZones: [],
  hills: [],
  paths: [],
});

export const TEMPLATES: Scenario[] = SUMIDERO;
