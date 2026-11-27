"use client";

import { motion, useReducedMotion } from "motion/react";
import { Card } from "@/shared/components/Card";
import { ROWS, type Metrics, type ProfileId } from "../data/comparison";

type Props = { title: string; metric: keyof Metrics; max: number; selected: ProfileId };

const FILL = { ga: "bg-ra-acc", grid: "bg-ra-yellow", random: "bg-ra-mut" };

export function MetricBars({ title, metric, max, selected }: Props) {
  const reduce = useReducedMotion();

  return (
    <Card className="flex flex-col gap-1 p-3">
      <h3 className="text-xs font-semibold">{title}</h3>
      {ROWS.map((row) => {
        const active = row.profile === selected;
        return (
          <div key={row.id} className="flex items-center gap-2 text-[11px]">
            <span className={`w-[100px] shrink-0 ${active ? "font-semibold" : "text-ra-mut"}`}>{row.short}</span>
            <span className="flex-1">
              <motion.span initial={{ width: reduce ? `${(row[metric] / max) * 100}%` : "0%" }} animate={{ width: `${(row[metric] / max) * 100}%` }} transition={{ duration: reduce ? 0 : 0.7, ease: "easeOut" }} className={`block h-[9px] rounded-[3px] ${FILL[row.kind]} ${active || row.kind === "grid" ? "" : "opacity-40"}`} />
            </span>
            <span className="w-8 text-right font-mono">{row[metric].toFixed(1)}</span>
          </div>
        );
      })}
    </Card>
  );
}
