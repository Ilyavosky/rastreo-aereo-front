import type { Point, Rect, ScenarioConfig } from "@/shared/types/domain";
import { insideRect } from "./geometry";

export const MAX_DRAWN_DRONES = 40;
export const MAX_DRAWN_POINTS = 30;

const noise = (n: number) => {
  const value = Math.sin(n * 91.7 + 47.3) * 43758.5453;
  return value - Math.floor(value);
};

function avoid(point: Point, zones: Rect[]): Point {
  const zone = zones.find((item) => insideRect(point, item));
  if (!zone) return point;
  const exits = [
    { distance: point.x - zone.x0, to: { x: zone.x0 - 10, y: point.y } },
    { distance: zone.x1 - point.x, to: { x: zone.x1 + 10, y: point.y } },
    { distance: point.y - zone.y0, to: { x: point.x, y: zone.y0 - 10 } },
    { distance: zone.y1 - point.y, to: { x: point.x, y: zone.y1 + 10 } },
  ];
  return exits.sort((a, b) => a.distance - b.distance)[0].to;
}

export function previewRoutes(config: ScenarioConfig, drones: number, points: number, variant = 0): Point[][] {
  const { widthM: w, heightM: h, base, forbiddenZones } = config;
  const count = Math.min(MAX_DRAWN_DRONES, Math.floor(drones));
  const stops = Math.min(MAX_DRAWN_POINTS, Math.floor(points));
  if (!base || !(count >= 1) || !(stops >= 1)) return [];

  const columns = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / columns);

  return Array.from({ length: count }, (_, drone) => {
    const row = Math.floor(drone / columns);
    const inRow = Math.min(columns, count - row * columns);
    const cellW = w / inRow;
    const cellH = h / rows;
    const centre = { x: ((drone % columns) + 0.5) * cellW, y: (row + 0.5) * cellH };
    const start = Math.atan2(base.y - centre.y, base.x - centre.x);

    return Array.from({ length: stops }, (_, i) => {
      const seed = variant * 997 + drone * 61 + i;
      const angle = start + ((i + 0.5) / stops) * Math.PI * 2;
      const reach = 0.28 + noise(seed) * 0.17;
      const point = { x: centre.x + Math.cos(angle) * cellW * reach, y: centre.y + Math.sin(angle) * cellH * reach };
      const inside = { x: Math.min(w, Math.max(0, point.x)), y: Math.min(h, Math.max(0, point.y)) };
      return avoid(inside, forbiddenZones);
    });
  });
}

export function parkingSpots(config: ScenarioConfig, drones: number): Point[] {
  const { widthM: w, heightM: h, base } = config;
  const count = Math.min(MAX_DRAWN_DRONES, Math.floor(drones));
  if (!base || !(count >= 1)) return [];

  const columns = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / columns);
  const gap = Math.max(w, h) * 0.045;
  const origin = (centre: number, cells: number, size: number) =>
    Math.min(Math.max(centre - ((cells - 1) * gap) / 2, gap / 2), size - (cells - 1) * gap - gap / 2);
  const left = origin(base.x, columns, w);
  const bottom = origin(base.y, rows, h);

  return Array.from({ length: count }, (_, i) => ({ x: left + (i % columns) * gap, y: bottom + Math.floor(i / columns) * gap }));
}
