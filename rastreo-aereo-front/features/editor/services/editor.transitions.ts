import type { Point, ScenarioConfig } from "@/shared/types/domain";
import { clampPoint, type Selection } from "./editor.rules";

const without = <T,>(list: T[], index: number) => list.filter((_, i) => i !== index);

export function removeElement(c: ScenarioConfig, s: Selection): ScenarioConfig {
  if (s.kind === "base") return { ...c, base: undefined };
  if (s.kind === "lastSeen") return { ...c, lastSeen: undefined };
  if (s.kind === "vegetation") return { ...c, vegetationZones: without(c.vegetationZones, s.index) };
  if (s.kind === "forbidden") return { ...c, forbiddenZones: without(c.forbiddenZones, s.index) };
  if (s.kind === "hill") return { ...c, hills: without(c.hills, s.index) };
  return { ...c, paths: without(c.paths, s.index) };
}

export function moveElement(c: ScenarioConfig, s: Selection, dx: number, dy: number): ScenarioConfig {
  const move = (p: Point) => clampPoint({ x: p.x + dx, y: p.y + dy }, c);
  const moveRect = <T extends { x0: number; y0: number; x1: number; y1: number }>(r: T): T => {
    const ox = Math.min(c.widthM - r.x1, Math.max(-r.x0, dx));
    const oy = Math.min(c.heightM - r.y1, Math.max(-r.y0, dy));
    return { ...r, x0: Math.round(r.x0 + ox), x1: Math.round(r.x1 + ox), y0: Math.round(r.y0 + oy), y1: Math.round(r.y1 + oy) };
  };
  const at = <T,>(list: T[], index: number, map: (item: T) => T) => list.map((item, i) => (i === index ? map(item) : item));

  if (s.kind === "base") return c.base ? { ...c, base: move(c.base) } : c;
  if (s.kind === "lastSeen") return c.lastSeen ? { ...c, lastSeen: move(c.lastSeen) } : c;
  if (s.kind === "vegetation") return { ...c, vegetationZones: at(c.vegetationZones, s.index, moveRect) };
  if (s.kind === "forbidden") return { ...c, forbiddenZones: at(c.forbiddenZones, s.index, moveRect) };
  if (s.kind === "hill") return { ...c, hills: at(c.hills, s.index, (h) => ({ ...h, ...move(h) })) };
  return { ...c, paths: at(c.paths, s.index, (path) => ({ ...path, points: path.points.map(move) })) };
}
