import type { Point, Rect } from "@/shared/types/domain";

export const insideRect = (point: Point, rect: Rect) =>
  point.x >= rect.x0 && point.x <= rect.x1 && point.y >= rect.y0 && point.y <= rect.y1;

export const rectFrom = (a: Point, b: Point): Rect => ({
  x0: Math.min(a.x, b.x),
  y0: Math.min(a.y, b.y),
  x1: Math.max(a.x, b.x),
  y1: Math.max(a.y, b.y),
});

export function smoothPath(points: Point[], height: number) {
  const p = points.map(({ x, y }) => ({ x, y: height - y }));
  if (p.length < 2) return "";
  let d = `M${p[0].x} ${p[0].y}`;
  for (let i = 0; i < p.length - 1; i++) {
    const [a, b, c, e] = [p[i - 1] ?? p[i], p[i], p[i + 1], p[i + 2] ?? p[i + 1]];
    d += `C${b.x + (c.x - a.x) / 6} ${b.y + (c.y - a.y) / 6} ${c.x - (e.x - b.x) / 6} ${c.y - (e.y - b.y) / 6} ${c.x} ${c.y}`;
  }
  return d;
}

export function parseRoute(text: string): Point[] {
  return text.split(" ").map((pair) => {
    const [x, y] = pair.split(",").map(Number);
    return { x, y: 1000 - y };
  });
}
