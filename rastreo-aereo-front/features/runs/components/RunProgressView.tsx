"use client";

import { X } from "lucide-react";
import { useMemo } from "react";
import { AppButton } from "@/shared/components/AppButton";
import { Card } from "@/shared/components/Card";
import { ErrorState } from "@/shared/components/Feedback";
import { NavButton } from "@/shared/components/NavButton";
import { MapView } from "@/shared/map/MapView";
import { MapViewToggle } from "@/shared/map/MapViewToggle";
import { previewRoutes } from "@/shared/map/previewRoutes";
import { SquareFit } from "@/shared/map/SquareFit";
import { useMapView } from "@/shared/map/useMapView";
import { Map3D } from "@/shared/map3d/Map3D";
import { CONVERGENCE } from "../data/convergence";
import { useRunProgress } from "../hooks/useRunProgress";
import { progressOf, STATUS_LABEL } from "../services/run.rules";
import { ConvergenceCard } from "./ConvergenceCard";
import { RunProgressSkeleton } from "./RunProgressSkeleton";

const FLIGHT_SECONDS: number[] = [];

export function RunProgressView({ id }: { id: string }) {
  const { run, error, isLoading, reload, cancel, isCancelling } = useRunProgress(id);
  const { isRelief } = useMapView();
  const config = run?.scenario;
  const drones = run?.drones ?? 0;
  const points = run?.points ?? 0;
  const routes = useMemo(() => (config ? previewRoutes(config, drones, points) : []), [config, drones, points]);
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (isLoading || !run) return <RunProgressSkeleton />;
  if (run.status === "failed") return <ErrorState message={run.error ?? "La corrida falló"} />;

  const percent = progressOf(run);
  const fraction = run.generation / run.generations;
  const running = run.status === "running";

  return (
    <div className="grid flex-1 gap-5 p-5 lg:grid-cols-[1fr_420px]">
      <div className="flex min-w-0 flex-col gap-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-semibold">{running ? "Corrida en curso" : `Corrida #${run.id}`}</h1>
            <p className="text-[13px] text-ra-mut">{run.scenarioName} · {run.drones} drones · {run.points} puntos · semilla {run.seed}</p>
          </div>
          {running ? (
            <AppButton tone="danger" onPress={cancel} isPending={isCancelling}>
              {isCancelling ? null : <X className="size-4" />} Cancelar corrida
            </AppButton>
          ) : run.status === "completed" ? (
            <NavButton href={`/corridas/${run.id}/resultados`}>Ver resultados</NavButton>
          ) : null}
        </div>
        <Card className="flex flex-col gap-2.5 p-4">
          <div className="flex justify-between font-mono text-[13px] font-medium">
            <span>Generación {run.generation} de {run.generations} · estado: {STATUS_LABEL[run.status].toLowerCase()}</span>
            <span className="text-ra-acc">{percent} %</span>
          </div>
          <div role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} className="h-2 overflow-hidden rounded bg-background">
            <div className={`h-full rounded bg-ra-acc transition-[width] duration-200 ease-linear ${running ? "animate-pulse motion-reduce:animate-none" : ""}`} style={{ width: `${percent}%` }} />
          </div>
          <p className="text-xs text-ra-mut">La búsqueda llega hasta 90 %; el resto son las líneas base (cuadrícula y azar).</p>
        </Card>
        <Card className="flex flex-1 flex-col items-center gap-2 p-3">
          <div className="flex w-full justify-end">
            <MapViewToggle />
          </div>
          {isRelief ? (
            <Map3D config={run.scenario} routes={routes} flightSeconds={FLIGHT_SECONDS} flying={running} />
          ) : (
            <SquareFit>
              <MapView config={run.scenario} routes={routes} faint waypoints flying={running} />
            </SquareFit>
          )}
          <p className="text-[11px] text-ra-mut">Vista previa ilustrativa (la API actual entrega rutas al terminar)</p>
        </Card>
      </div>
      <div className="ra-stagger flex flex-col gap-3">
        {CONVERGENCE.map((series) => <ConvergenceCard key={series.key} series={series} fraction={fraction} />)}
        <Card className="flex justify-between p-3.5">
          <span className="text-xs font-medium text-ra-mut">Soluciones factibles</span>
          <span className="font-mono text-sm font-medium">{Math.round(run.population * Math.min(52 / 60, fraction * 1.34))} / {run.population}</span>
        </Card>
        <p className="text-[11px] text-ra-mut">Valores de convergencia de ejemplo.</p>
      </div>
    </div>
  );
}
