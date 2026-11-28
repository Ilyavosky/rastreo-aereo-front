import type { Point, Scenario, ScenarioConfig } from "@/shared/types/domain";

const SIZE_M = 3000;
const SIGMA_M = 170;
const SPACING_M = 250;
const HILL_M = 235;
const CHANNEL_M = 330;
const EDGE_BOOST = 1.4;
const LINE = Array.from({ length: SIZE_M / SPACING_M + 1 }, (_, i) => i * SPACING_M);

const points = (...pairs: [number, number][]): Point[] => pairs.map(([x, y]) => ({ x, y }));

function distanceToLine(point: Point, line: Point[]) {
  return Math.min(
    ...line.slice(1).map((end, i) => {
      const start = line[i];
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const t = Math.min(1, Math.max(0, ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy)));
      return Math.hypot(point.x - start.x - dx * t, point.y - start.y - dy * t);
    }),
  );
}

const edge = (value: number) => (value === 0 || value === SIZE_M ? EDGE_BOOST : 1);

const walls = (river: Point[]): ScenarioConfig["hills"] =>
  LINE.flatMap((x) =>
    LINE.filter((y) => distanceToLine({ x, y }, river) > CHANNEL_M).map((y) => ({
      x,
      y,
      heightM: Math.round(HILL_M * edge(x) * edge(y) * (1 + 0.14 * Math.sin(x / 410) * Math.cos(y / 530))),
      sigmaM: SIGMA_M,
    })),
  );

type Canyon = {
  id: string;
  name: string;
  river: Point[];
  extraPaths?: ScenarioConfig["paths"];
  base: Point;
  lastSeen: Point;
  forbiddenZones?: ScenarioConfig["forbiddenZones"];
};

const canyon = ({ id, name, river, extraPaths = [], base, lastSeen, forbiddenZones = [] }: Canyon): Scenario => ({
  id,
  name,
  isTemplate: true,
  config: {
    widthM: SIZE_M,
    heightM: SIZE_M,
    cellM: 20,
    base,
    lastSeen,
    vegetationDefault: "brush",
    vegetationZones: [
      { type: "dense", x0: 0, y0: 0, x1: 900, y1: 1300 },
      { type: "dense", x0: 2000, y0: 1500, x1: 3000, y1: 3000 },
    ],
    forbiddenZones,
    hills: walls(river),
    paths: [{ kind: "river", points: river }, ...extraPaths],
  },
});

export const SUMIDERO: Scenario[] = [
  canyon({
    id: "sumidero-la-coyota",
    name: "Sumidero · La Coyota",
    river: points([1500, 0], [1380, 500], [1250, 1000], [1420, 1500], [1750, 1950], [1650, 2500], [1500, 3000]),
    base: { x: 1520, y: 150 },
    lastSeen: { x: 1600, y: 1850 },
  }),
  canyon({
    id: "sumidero-arbol-de-navidad",
    name: "Sumidero · Árbol de Navidad",
    river: points([1900, 0], [2000, 600], [1750, 1150], [1200, 1500], [1000, 2100], [1250, 2600], [1350, 3000]),
    extraPaths: [{ kind: "river", points: points([420, 1250], [750, 1340], [1000, 1420], [1200, 1500]) }],
    base: { x: 1920, y: 180 },
    lastSeen: { x: 1050, y: 1560 },
  }),
  canyon({
    id: "sumidero-presa-chicoasen",
    name: "Sumidero · Presa Chicoasén",
    river: points([1100, 0], [1250, 550], [1600, 1050], [1700, 1600], [1500, 2150], [1450, 2600], [1450, 3000]),
    base: { x: 1130, y: 180 },
    lastSeen: { x: 1650, y: 1750 },
    forbiddenZones: [{ x0: 1180, y0: 2450, x1: 1750, y1: 2800 }],
  }),
];
