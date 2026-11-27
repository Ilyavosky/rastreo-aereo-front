"use client";

import { ArrowLeft, Plus } from "lucide-react";
import { NavButton } from "@/shared/components/NavButton";
import { AnimatedNumber } from "@/shared/motion/AnimatedNumber";
import { PROFILE_IDS, PROFILES } from "../data/comparison";
import { useResults } from "../hooks/useResults";
import { ComparisonTable } from "./ComparisonTable";
import { DetailMap } from "./DetailMap";
import { ParetoChart } from "./ParetoChart";
import { ResultsGate } from "./ResultsGate";
import { ResultsSkeleton } from "./ResultsSkeleton";

export function DetailView({ id }: { id: string }) {
  const { run, error, isLoading, reload, profileId, setProfileId } = useResults(id);

  return (
    <ResultsGate run={run} error={error} isLoading={isLoading} reload={reload} skeleton={<ResultsSkeleton />}>
      {(current) => (
        <div className="grid flex-1 gap-4 p-4 xl:grid-cols-[650px_1fr]">
          <DetailMap config={current.scenario} profileId={profileId} />
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h1 className="text-xl font-semibold">Resultados · {current.scenarioName}</h1>
              <div className="flex gap-2">
                <NavButton href={`/corridas/${id}/resultados`} tone="ghost"><ArrowLeft className="size-4" /> Volver a comparación</NavButton>
                <NavButton href="/mision" tone="ghost"><Plus className="size-4" /> Nueva misión</NavButton>
              </div>
            </div>
            <div className="ra-stagger grid gap-2.5 sm:grid-cols-3">
              {PROFILE_IDS.map((key) => {
                const { label, ga } = PROFILES[key];
                const active = key === profileId;
                return (
                  <button key={key} type="button" aria-pressed={active} onClick={() => setProfileId(key)} className={`flex cursor-pointer flex-col gap-1.5 rounded-[10px] border p-3.5 text-left ${active ? "border-2 border-ra-acc bg-ra-panel2" : "border-ra-line bg-ra-panel"}`}>
                    <span className={`text-xs font-semibold ${active ? "text-ra-acc" : "text-ra-mut"}`}>{label}</span>
                    <span className="font-mono text-[28px] font-medium leading-none"><AnimatedNumber value={ga.rde} /> %</span>
                    <span className="font-mono text-xs text-ra-mut">{ga.time.toFixed(1)} min · {ga.energy.toFixed(1)} Wh</span>
                  </button>
                );
              })}
            </div>
            <ParetoChart selected={profileId} />
            <ComparisonTable selected={profileId} />
          </div>
        </div>
      )}
    </ResultsGate>
  );
}
