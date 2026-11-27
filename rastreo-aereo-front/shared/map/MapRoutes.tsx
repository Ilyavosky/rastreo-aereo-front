"use client";

import { Navigation2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { Point } from "@/shared/types/domain";
import { DroneFlight } from "./DroneFlight";
import { droneColor } from "./droneColor";

type Props = {
  routes: Point[][];
  base: Point;
  height: number;
  unit: number;
  swath?: boolean;
  faint?: boolean;
  waypoints?: boolean;
  flying?: boolean;
  flightSeconds?: number[];
  parked?: Point[];
};

const DRAW_SECONDS = 1.4;

export function MapRoutes({ routes, base, height, unit, swath, faint, waypoints, flying, flightSeconds, parked }: Props) {
  const reduce = useReducedMotion();

  return (
    <g fill="none" strokeLinejoin="round" strokeLinecap="round">
      {routes.map((route, i) => {
        const color = droneColor(i);
        const d = `M${[base, ...route, base].map((p) => `${p.x} ${height - p.y}`).join("L")}`;
        const draw = {
          initial: { pathLength: reduce ? 1 : 0 },
          animate: { pathLength: 1 },
          transition: { duration: DRAW_SECONDS, delay: (i % 5) * 0.15, ease: "easeInOut" as const },
        };
        return (
          <g key={`${i}-${d}`} stroke={color}>
            {swath ? <motion.path {...draw} d={d} strokeOpacity={0.14} strokeWidth={80} /> : null}
            <motion.path {...draw} d={d} strokeWidth={faint ? 4 : 5} strokeOpacity={faint ? 0.45 : 1} />
            {waypoints
              ? route.map((p, k) => (
                  <circle key={k} cx={p.x} cy={height - p.y} r={8} fill="#0f1c1b" strokeWidth={3.5} className="ra-appear" style={{ animationDelay: `${(i % 5) * 0.15 + (DRAW_SECONDS * (k + 1)) / (route.length + 1)}s` }} />
                ))
              : null}
            {flying && !reduce ? <DroneFlight path={d} color={color} size={38 * unit} seconds={flightSeconds?.[i] ?? 10 + (i % 5) * 1.5} /> : null}
          </g>
        );
      })}
      {parked?.map((spot, i) => (
        <Navigation2 key={i} x={spot.x - 19 * unit} y={height - spot.y - 19 * unit} width={38 * unit} height={38 * unit} fill={droneColor(i)} stroke="#fff" />
      ))}
    </g>
  );
}
