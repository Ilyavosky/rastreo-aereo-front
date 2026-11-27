"use client";

import { Box, Map as MapIcon, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { NavButton } from "@/shared/components/NavButton";
import { Pill } from "@/shared/components/Pill";
import { MapView } from "@/shared/map/MapView";
import { SquareFit } from "@/shared/map/SquareFit";
import { Map3D } from "@/shared/map3d/Map3D";
import type { Scenario } from "@/shared/types/domain";

export function MapPanel({ scenario }: { scenario: Scenario }) {
  const [relief, setRelief] = useState(true);

  return (
    <div className="flex min-h-[520px] min-w-0 flex-1 flex-col items-center gap-3 p-4">
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Mapa del escenario · {scenario.name}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Pill active={!relief} onClick={() => setRelief(false)}>
            <span className="flex items-center gap-1.5"><MapIcon className="size-3.5" /> Mapa 2D</span>
          </Pill>
          <Pill active={relief} onClick={() => setRelief(true)}>
            <span className="flex items-center gap-1.5"><Box className="size-3.5" /> Relieve 3D</span>
          </Pill>
          <NavButton href={`/escenarios/editor/${scenario.id}`}><Pencil className="size-4" /> Editar mapa</NavButton>
          <NavButton href="/escenarios/editor/nuevo" tone="ghost"><Plus className="size-4" /> Mapa nuevo</NavButton>
        </div>
      </div>
      {relief ? (
        <Map3D config={scenario.config} routes={[]} flightSeconds={[]} flying={false} priority />
      ) : (
        <SquareFit>
          <MapView config={scenario.config} priority />
        </SquareFit>
      )}
      {relief && scenario.config.hills.length === 0 ? (
        <p className="text-xs text-ra-yellow">Este escenario no tiene colinas, por eso se ve plano. Prueba «Sendero de montaña» o agrega una colina en «Editar mapa».</p>
      ) : null}
      <p className="font-mono text-xs text-ra-mut">□ base   ● último avistamiento   - - sendero   ━ río   ▨ zona prohibida   ◌ prioridad (solo visual)</p>
    </div>
  );
}
