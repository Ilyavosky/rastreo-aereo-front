import { parseRoute } from "@/shared/map/geometry";
import type { Point } from "@/shared/types/domain";

export type Metrics = { rde: number; time: number; energy: number };
export type ProfileId = "detection" | "balanced" | "consumption";

type Method = Metrics & { routes: Point[][] };
type DroneLog = { name: string; drone: string; camera: string; time: number; energy: number };

const routes = (...list: string[]) => list.map(parseRoute);

const drones = (values: [number, number][]): DroneLog[] =>
  values.map(([time, energy], i) => ({
    name: `Dron ${i + 1}`,
    drone: ["Estándar", "Estándar", "Ligero"][i],
    camera: ["Óptica 4K", "Óptica 2K", "Óptica 4K"][i],
    time,
    energy,
  }));

export const PROFILES: Record<ProfileId, { label: string; note: string; ga: Method; random: Method; drones: DroneLog[] }> = {
  detection: {
    label: "Mayor detección",
    note: "La cuadrícula detecta más (67.4 %). El AG tarda menos (12.3 contra 15.7 min) pero gasta más energía.",
    ga: { rde: 49.7, time: 12.3, energy: 57.1, routes: routes("60,940 120,720 90,520 150,330 100,140 260,90 330,250 300,450 220,640", "60,940 250,800 380,620 440,430 520,260 640,170 600,370 520,560 390,760", "60,940 300,900 500,820 640,680 780,560 890,420 820,300 720,480 560,720") },
    random: { rde: 33.5, time: 17.5, energy: 71.7, routes: routes("60,940 700,200 180,380 520,860 90,120", "60,940 880,640 300,150 640,700 420,300", "60,940 230,610 910,180 760,880 330,820") },
    drones: drones([[12.3, 20.4], [11.5, 19.1], [10.6, 17.6]]),
  },
  balanced: {
    label: "Equilibrada",
    note: "La cuadrícula detecta más (67.4 %). El AG usa menos tiempo y menos energía.",
    ga: { rde: 31.4, time: 8.3, energy: 33.6, routes: routes("60,940 140,760 130,560 220,420 200,260 320,230 360,370 300,520 220,720", "60,940 260,780 400,640 470,470 560,330 660,260 650,400 540,560 380,760", "60,940 280,890 470,830 610,720 720,600 800,470 740,430 640,560 480,740") },
    random: { rde: 27.8, time: 12.7, energy: 47.6, routes: routes("60,940 520,300 200,200 380,720", "60,940 760,560 480,220 300,600", "60,940 640,820 840,340 520,640") },
    drones: drones([[8.3, 11.9], [7.6, 11.2], [7.1, 10.5]]),
  },
  consumption: {
    label: "Menor consumo",
    note: "La cuadrícula detecta más (67.4 %). El AG usa menos tiempo y menos energía.",
    ga: { rde: 23.7, time: 7.5, energy: 28.7, routes: routes("60,940 130,800 150,650 230,550 250,440 330,450 320,570 250,680 170,820", "60,940 230,800 340,680 420,540 520,420 600,390 560,500 430,640 270,800", "60,940 260,910 420,860 540,780 620,670 660,590 580,630 450,740 300,860") },
    random: { rde: 7.0, time: 13.4, energy: 42.9, routes: routes("60,940 260,520 400,700", "60,940 420,480 520,800", "60,940 300,640 220,360") },
    drones: drones([[7.5, 10.2], [6.9, 9.6], [6.4, 8.9]]),
  },
};

export const PROFILE_IDS: ProfileId[] = ["detection", "balanced", "consumption"];

export const GRID: Method = {
  rde: 67.4,
  time: 15.7,
  energy: 48.1,
  routes: routes("60,940 60,40 270,40 270,960", "60,940 400,960 400,40 600,40 600,960", "60,940 730,960 730,40 930,40 930,960"),
};

export const PARETO_EXTRA: [number, number][] = [[30, 25], [31.5, 28], [36, 34], [39, 37], [43, 41], [47, 44], [52, 47]];

export type Row = Metrics & { id: string; label: string; short: string; kind: "ga" | "grid" | "random"; profile?: ProfileId };

export const ROWS: Row[] = [
  ...PROFILE_IDS.map((id) => ({ ...PROFILES[id].ga, id: `ga-${id}`, label: `AG · ${PROFILES[id].label.toLowerCase()}`, short: `AG ${["detección", "equilibrada", "consumo"][PROFILE_IDS.indexOf(id)]}`, kind: "ga" as const, profile: id })),
  { ...GRID, id: "grid", label: "Cuadrícula", short: "Cuadrícula", kind: "grid" },
  ...PROFILE_IDS.map((id) => ({ ...PROFILES[id].random, id: `rnd-${id}`, label: `Azar · ${PROFILES[id].label.toLowerCase()}`, short: `Azar ${["detección", "equilibrada", "consumo"][PROFILE_IDS.indexOf(id)]}`, kind: "random" as const, profile: id })),
];
