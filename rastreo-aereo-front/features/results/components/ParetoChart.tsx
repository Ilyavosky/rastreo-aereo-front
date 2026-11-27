"use client";

import { motion, useReducedMotion } from "motion/react";
import { Card } from "@/shared/components/Card";
import { GRID, PARETO_EXTRA, PROFILE_IDS, PROFILES, type ProfileId } from "../data/comparison";

const W = 700;
const H = 220;
const x = (energy: number) => 40 + ((energy - 20) / 60) * (W - 60);
const y = (rde: number) => H - 24 - (rde / 80) * (H - 34);

export function ParetoChart({ selected }: { selected: ProfileId }) {
  const reduce = useReducedMotion();

  return (
    <Card className="flex flex-col gap-2 p-3.5">
      <h2 className="text-[13px] font-medium">Frente de Pareto: detección contra energía</h2>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Dispersión de detección contra energía">
        <g className="fill-ra-mut font-mono text-[10px]">
          {[0, 20, 40, 60, 80].map((v) => (
            <g key={v}>
              <path d={`M40 ${y(v)}H${W - 20}`} stroke="#263643" />
              <text x={14} y={y(v) + 3}>{v}</text>
            </g>
          ))}
          {[20, 40, 60, 80].map((e) => <text key={e} x={x(e) - 14} y={H - 4}>{e} Wh</text>)}
        </g>
        {PARETO_EXTRA.map(([e, v]) => <circle key={e} cx={x(e)} cy={y(v)} r={4} fill="#3ccfb4" fillOpacity={0.55} className="ra-appear" />)}
        {PROFILE_IDS.map((id) => {
          const { ga, random, label } = PROFILES[id];
          return (
            <g key={id}>
              {id === selected ? <circle cx={x(ga.energy)} cy={y(ga.rde)} r={9} fill="none" stroke="#ff7a45" strokeWidth={2} className="ra-ping" /> : null}
              <motion.circle cx={x(ga.energy)} cy={y(ga.rde)} initial={{ r: 0 }} animate={{ r: id === selected ? 9 : 6 }} transition={{ duration: reduce ? 0 : 0.3 }} fill={id === selected ? "#ff7a45" : "#3ccfb4"}>
                <title>{`${label}: ${ga.rde} % · ${ga.energy} Wh`}</title>
              </motion.circle>
              <path d={`M${x(random.energy) - 5} ${y(random.rde) - 5}l10 10m0-10l-10 10`} stroke="#8ca0af" strokeWidth={2.5} />
            </g>
          );
        })}
        <rect x={x(GRID.energy) - 6} y={y(GRID.rde) - 6} width={12} height={12} fill="#f2c14e" />
      </svg>
      <p className="font-mono text-[11px] text-ra-mut">● AG (frente)   ◉ seleccionada   ■ cuadrícula   × azar</p>
    </Card>
  );
}
