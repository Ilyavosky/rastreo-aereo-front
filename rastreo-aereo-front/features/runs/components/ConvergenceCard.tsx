import { Card } from "@/shared/components/Card";
import { CONVERGENCE } from "../data/convergence";

type Props = { series: (typeof CONVERGENCE)[number]; fraction: number };

const REFERENCE = 26 / 40;

export function ConvergenceCard({ series, fraction }: Props) {
  const count = Math.max(1, Math.min(series.points.length, Math.round((fraction / REFERENCE) * series.points.length)));
  const shown = series.points.slice(0, count);
  const d = shown.map((v, i) => `${i ? "L" : "M"}${(i * 390 * REFERENCE) / (series.points.length - 1)} ${100 - v * 100}`).join(" ");
  const value = series.from + (series.final - series.from) * Math.min(1, fraction / REFERENCE);

  return (
    <Card className="flex flex-col gap-2 p-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-ra-mut">{series.label}</h3>
        <span className="font-mono text-lg font-medium" style={{ color: series.color }}>{value.toFixed(series.digits)}</span>
      </div>
      <svg viewBox="0 0 390 100" preserveAspectRatio="none" className="h-[88px] w-full" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M0 ${2 + i * 32}H390`} stroke="#263643" />)}
        <path d={d} fill="none" stroke={series.color} strokeWidth={2.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </Card>
  );
}
