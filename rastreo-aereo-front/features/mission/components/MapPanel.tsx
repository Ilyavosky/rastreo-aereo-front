import { Map as MapIcon, Plus } from "lucide-react";
import { NavButton } from "@/shared/components/NavButton";
import { MapView } from "@/shared/map/MapView";
import { SquareFit } from "@/shared/map/SquareFit";
import type { Scenario } from "@/shared/types/domain";

export function MapPanel({ scenario }: { scenario: Scenario }) {
  return (
    <div className="flex min-h-[520px] min-w-0 flex-1 flex-col items-center gap-3 p-4">
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Mapa del escenario · {scenario.name}</h2>
        <div className="flex gap-2">
          <NavButton href={`/escenarios/editor/${scenario.id}`}><MapIcon className="size-4" /> Editar mapa</NavButton>
          <NavButton href="/escenarios/editor/nuevo" tone="ghost"><Plus className="size-4" /> Mapa nuevo</NavButton>
        </div>
      </div>
      <SquareFit>
        <MapView config={scenario.config} priority />
      </SquareFit>
      <p className="font-mono text-xs text-ra-mut">□ base   ● último avistamiento   - - sendero   ━ río   ▨ zona prohibida   ◌ prioridad (solo visual)</p>
    </div>
  );
}
