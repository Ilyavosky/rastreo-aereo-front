"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Point } from "@/shared/types/domain";
import { DroneFlight } from "./DroneFlight";

export const DRONE_COLORS = ["#ff7a45", "#3ccfb4", "#5aa9ff", "#f2c14e", "#c58cff"];

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
};

const DRAW_SECONDS = 1.4;

export function MapRoutes({ routes, base, height, unit, swath, faint, waypoints, flying, flightSeconds }: Props) {
  const reduce = useReducedMotion();

  return (
    <g fill="none" strokeLinejoin="round" strokeLinecap="round">
      {routes.map((route, i) => {
        const color = DRONE_COLORS[i % DRONE_COLORS.length];
        const d = `M${[base, ...route, base].map((p) => `${p.x} ${height - p.y}`).join("L")}`;
        const draw = {
          initial: { pathLength: reduce ? 1 : 0 },
          animate: { pathLength: 1 },
          transition: { duration: DRAW_SECONDS, delay: i * 0.15, ease: "easeInOut" as const },
        };
        return (
          <g key={`${i}-${d}`} stroke={color}>
            {swath ? <motion.path {...draw} d={d} strokeOpacity={0.14} strokeWidth={80} /> : null}
            <motion.path {...draw} d={d} strokeWidth={faint ? 4 : 5} strokeOpacity={faint ? 0.45 : 1} />
            {waypoints
              ? route.map((p, k) => (
                  <circle key={k} cx={p.x} cy={height - p.y} r={8} fill="#0f1c1b" strokeWidth={3.5} className="ra-appear" style={{ animationDelay: `${i * 0.15 + (DRAW_SECONDS * (k + 1)) / (route.length + 1)}s` }} />
                ))
              : null}
            {flying && !reduce ? <DroneFlight path={d} color={color} size={38 * unit} seconds={flightSeconds?.[i] ?? 10 + i * 1.5} /> : null}
          </g>
        );
      })}
    </g>
  );
}
