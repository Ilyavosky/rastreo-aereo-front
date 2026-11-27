import { Card } from "@/shared/components/Card";
import { AnimatedNumber } from "@/shared/motion/AnimatedNumber";
import { MapView } from "@/shared/map/MapView";
import type { Point, ScenarioConfig } from "@/shared/types/domain";
import type { Metrics } from "../data/comparison";

type Props = { title: string; color: string; config: ScenarioConfig; metrics: Metrics & { routes: Point[][] } };

export function MethodCard({ title, color, config, metrics }: Props) {
  return (
    <Card className="flex flex-col items-center gap-2 p-3">
      <h2 className={`text-sm font-semibold ${color}`}>{title}</h2>
      <MapView config={config} routes={metrics.routes} swath label={`Rutas de ${title}`} className="aspect-square w-full max-w-[420px]" />
      <p className="font-mono text-[13px] font-medium">
        <AnimatedNumber value={metrics.rde} /> % · <AnimatedNumber value={metrics.time} /> min · <AnimatedNumber value={metrics.energy} /> Wh
      </p>
    </Card>
  );
}
