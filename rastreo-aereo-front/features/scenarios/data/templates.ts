import { parseRoute } from "@/shared/map/geometry";
import type { Scenario, ScenarioConfig } from "@/shared/types/domain";

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

const river = { kind: "river" as const, points: parseRoute("0,250 150,282 300,265 450,330 620,480 760,700 870,860 1000,930") };
const trail = { kind: "trail" as const, points: parseRoute("60,940 200,780 350,720 420,590 520,420 640,330 800,220 940,90") };
const hills = [
  { x: 720, y: 750, heightM: 80, sigmaM: 115 },
  { x: 230, y: 440, heightM: 60, sigmaM: 85 },
];
const vegetation = [
  { type: "brush" as const, x0: 0, y0: 600, x1: 400, y1: 1000 },
  { type: "dense" as const, x0: 580, y0: 0, x1: 1000, y1: 480 },
];
const base = { x: 60, y: 60 };
const lastSeen = { x: 640, y: 670 };

export const TEMPLATES: Scenario[] = [
  {
    id: "sendero-de-montana",
    name: "Sendero de montaña",
    isTemplate: true,
    config: { ...emptyConfig(), base, lastSeen, hills, paths: [river, trail], vegetationZones: vegetation, forbiddenZones: [{ x0: 800, y0: 130, x1: 940, y1: 280 }] },
  },
  {
    id: "valle-con-rio",
    name: "Valle con río",
    isTemplate: true,
    config: { ...emptyConfig(), base, hills, paths: [river, trail] },
  },
  {
    id: "bosque-denso",
    name: "Bosque denso",
    isTemplate: true,
    config: { ...emptyConfig(), base, lastSeen, vegetationZones: vegetation },
  },
];
