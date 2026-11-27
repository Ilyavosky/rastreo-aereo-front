"use client";

import { ChartScatter, Plus } from "lucide-react";
import { NavButton } from "@/shared/components/NavButton";
import { Pill } from "@/shared/components/Pill";
import { GRID, PROFILE_IDS, PROFILES } from "../data/comparison";
import { useResults } from "../hooks/useResults";
import { exampleRoutes } from "../services/routes";
import { MethodCard } from "./MethodCard";
import { MetricBars } from "./MetricBars";
import { ResultsGate } from "./ResultsGate";
import { ResultsSkeleton } from "./ResultsSkeleton";

export function ComparisonView({ id }: { id: string }) {
  const { run, error, isLoading, reload, profileId, setProfileId, profile } = useResults(id);
  const label = profile.label.toLowerCase();

  return (
    <ResultsGate run={run} error={error} isLoading={isLoading} reload={reload} skeleton={<ResultsSkeleton />}>
      {(current) => {
        const { scenario: config, drones, points } = current;
        const withRoutes = <T extends typeof GRID>(method: T, variant: number) => ({ ...method, routes: exampleRoutes({ sample: method.routes, config, drones, points, variant }) });
        const variant = PROFILE_IDS.indexOf(profileId);

        return (
        <div className="flex flex-col gap-3 px-4 py-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold">Resultados · {current.scenarioName}</h1>
              <p className="text-xs text-ra-mut">{current.drones} drones · {current.points} puntos · {current.generations} generaciones · población {current.population}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {PROFILE_IDS.map((key) => (
                <Pill key={key} active={key === profileId} onClick={() => setProfileId(key)}>{PROFILES[key].label}</Pill>
              ))}
              <span className="w-2" />
              <NavButton href={`/corridas/${id}/resultados/detalle`} tone="ghost"><ChartScatter className="size-4" /> Ver rutas y Pareto</NavButton>
              <NavButton href="/mision"><Plus className="size-4" /> Nueva misión</NavButton>
            </div>
          </div>
          <div className="ra-stagger grid gap-3 lg:grid-cols-3">
            <MethodCard title={`AG · ${label}`} color="text-ra-acc" config={current.scenario} metrics={withRoutes(profile.ga, variant)} />
            <MethodCard title="Barrido en cuadrícula" color="text-ra-yellow" config={current.scenario} metrics={withRoutes(GRID, 3)} />
            <MethodCard title={`Azar · ${label}`} color="text-ra-mut" config={current.scenario} metrics={withRoutes(profile.random, variant + 4)} />
          </div>
          <div className="ra-stagger grid gap-3 lg:grid-cols-3">
            <MetricBars title="Detección R_de (%) · más es mejor" metric="rde" max={75} selected={profileId} />
            <MetricBars title="Tiempo (min) · menos es mejor" metric="time" max={19} selected={profileId} />
            <MetricBars title="Energía (Wh) · menos es mejor" metric="energy" max={78} selected={profileId} />
          </div>
          <p className="text-xs text-ra-yellow">{profile.note} Resultados y rutas de ejemplo: no se calculan en el navegador.</p>
        </div>
        );
      }}
    </ResultsGate>
  );
}
