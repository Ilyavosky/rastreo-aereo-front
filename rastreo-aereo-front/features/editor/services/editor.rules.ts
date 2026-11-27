import { insideRect } from "@/shared/map/geometry";
import type { Point, ScenarioConfig } from "@/shared/types/domain";

export type Tool = "select" | "base" | "lastSeen" | "vegetation" | "forbidden" | "hill" | "trail" | "river";
export type Selection = { kind: "base" } | { kind: "lastSeen" } | { kind: "vegetation" | "forbidden" | "hill" | "path"; index: number };

export const MAX_CELLS = 40000;

export const cellCount = (c: ScenarioConfig) => (c.cellM > 0 ? Math.ceil(c.widthM / c.cellM) * Math.ceil(c.heightM / c.cellM) : 0);

export const clampPoint = (p: Point, c: ScenarioConfig): Point => ({
  x: Math.round(Math.min(c.widthM, Math.max(0, p.x))),
  y: Math.round(Math.min(c.heightM, Math.max(0, p.y))),
});

export function configProblem(config: ScenarioConfig) {
  const { base, widthM, heightM, cellM } = config;
  if (!(widthM > 0 && heightM > 0 && cellM > 0)) return "El ancho, el alto y la celda deben ser mayores que 0.";
  if (cellCount(config) > MAX_CELLS) return "La cuadrícula supera las 40 000 celdas.";
  if (!base) return "Falta colocar la base.";
  const points = [base, config.lastSeen, ...config.paths.flatMap((p) => p.points), ...config.hills].filter(Boolean) as Point[];
  if (points.some((p) => p.x > widthM || p.y > heightM)) return "Hay elementos fuera del mapa.";
  if (config.forbiddenZones.some((zone) => insideRect(base, zone))) return "La base no puede quedar dentro de una zona prohibida.";
  return "";
}

export function hitTest(c: ScenarioConfig, p: Point): Selection | undefined {
  const near = (q: Point, r = 30) => Math.hypot(q.x - p.x, q.y - p.y) <= r;
  if (c.base && near(c.base)) return { kind: "base" };
  if (c.lastSeen && near(c.lastSeen)) return { kind: "lastSeen" };
  const hill = c.hills.findIndex((h) => near(h, h.sigmaM));
  const forbidden = c.forbiddenZones.findIndex((z) => insideRect(p, z));
  if (forbidden >= 0) return { kind: "forbidden", index: forbidden };
  const path = c.paths.findIndex((item) => item.points.some((q) => near(q, 40)));
  if (path >= 0) return { kind: "path", index: path };
  if (hill >= 0) return { kind: "hill", index: hill };
  const vegetation = c.vegetationZones.findIndex((z) => insideRect(p, z));
  return vegetation >= 0 ? { kind: "vegetation", index: vegetation } : undefined;
}
