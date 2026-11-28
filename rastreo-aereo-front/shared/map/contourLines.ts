import type { ScenarioConfig } from "@/shared/types/domain";

const GRID = 90;

export function contourPaths({ widthM: w, heightM: h, hills }: ScenarioConfig, levels = 8) {
  const heights = Array.from({ length: GRID + 1 }, (_, j) =>
    Array.from({ length: GRID + 1 }, (_, i) => {
      const x = (i / GRID) * w;
      const y = h - (j / GRID) * h;
      return hills.reduce((sum, hill) => sum + hill.heightM * Math.exp(-((x - hill.x) ** 2 + (y - hill.y) ** 2) / (2 * hill.sigmaM ** 2)), 0);
    }),
  );
  const top = Math.max(...heights.map((row) => Math.max(...row)));

  return Array.from({ length: levels }, (_, k) => {
    const level = (top * (k + 1)) / (levels + 1);
    let d = "";
    for (let j = 0; j < GRID; j++) {
      for (let i = 0; i < GRID; i++) {
        const corners = [
          [i, j, heights[j][i]],
          [i + 1, j, heights[j][i + 1]],
          [i + 1, j + 1, heights[j + 1][i + 1]],
          [i, j + 1, heights[j + 1][i]],
        ];
        const crossings = corners.flatMap(([x0, y0, a], n) => {
          const [x1, y1, b] = corners[(n + 1) % 4];
          if (a < level === b < level) return [];
          const t = (level - a) / (b - a);
          return [`${(((x0 + (x1 - x0) * t) / GRID) * w).toFixed(0)} ${(((y0 + (y1 - y0) * t) / GRID) * h).toFixed(0)}`];
        });
        for (let n = 0; n + 1 < crossings.length; n += 2) d += `M${crossings[n]}L${crossings[n + 1]}`;
      }
    }
    return { level, share: level / top, d };
  });
}
