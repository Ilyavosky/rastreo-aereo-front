import { insideRect } from "@/shared/map/geometry";
import type { Point, ScenarioConfig, VegetationType } from "@/shared/types/domain";

const MAX_EXAGGERATION = 3;
const PEAK_SHARE = 0.3;
export const SCENE_SIZE = 10;
export const FLIGHT_HEIGHTS_M = [40, 60, 80, 100, 120];

export type Vec3 = [number, number, number];

const rawElevation = (hills: ScenarioConfig["hills"], x: number, y: number) =>
  hills.reduce((sum, hill) => sum + hill.heightM * Math.exp(-((x - hill.x) ** 2 + (y - hill.y) ** 2) / (2 * hill.sigmaM ** 2)), 0);

export function reliefExaggeration({ widthM, heightM, hills }: ScenarioConfig) {
  const peak = Math.max(0, ...hills.map((hill) => rawElevation(hills, hill.x, hill.y)));
  if (!peak) return MAX_EXAGGERATION;
  const wanted = (PEAK_SHARE * Math.max(widthM, heightM)) / peak;
  return Math.round(Math.min(MAX_EXAGGERATION, Math.max(1, wanted)) * 10) / 10;
}

export function createProjector(config: ScenarioConfig) {
  const { widthM: w, heightM: h, hills } = config;
  const scale = SCENE_SIZE / Math.max(w, h);
  const exaggeration = reliefExaggeration(config);
  const elevation = (x: number, y: number) => rawElevation(hills, x, y) * exaggeration;
  const place = ({ x, y }: Point, aboveM = 0): Vec3 => [(x - w / 2) * scale, (elevation(x, y) + aboveM) * scale, (h / 2 - y) * scale];

  return { scale, elevation, place, width: w * scale, depth: h * scale };
}

export type Projector = ReturnType<typeof createProjector>;

export function densify(points: Point[], stepM: number): Point[] {
  return points.flatMap((point, i) => {
    const next = points[i + 1];
    if (!next) return [point];
    const steps = Math.max(1, Math.ceil(Math.hypot(next.x - point.x, next.y - point.y) / stepM));
    return Array.from({ length: steps }, (_, k) => ({
      x: point.x + ((next.x - point.x) * k) / steps,
      y: point.y + ((next.y - point.y) * k) / steps,
    }));
  });
}

export function vegetationAt(config: ScenarioConfig, point: Point): VegetationType {
  return config.vegetationZones.findLast((zone) => insideRect(point, zone))?.type ?? config.vegetationDefault;
}

export const noise = (n: number) => {
  const value = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};
