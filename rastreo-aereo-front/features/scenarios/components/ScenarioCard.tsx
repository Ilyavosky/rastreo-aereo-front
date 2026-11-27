"use client";

import { Map, Trash2 } from "lucide-react";
import { AppButton } from "@/shared/components/AppButton";
import { Card } from "@/shared/components/Card";
import { NavButton } from "@/shared/components/NavButton";
import { MapView } from "@/shared/map/MapView";
import type { Scenario } from "@/shared/types/domain";
import { selectScenario } from "../services/scenario.service";

type Props = { scenario: Scenario; onDelete?: () => void; isDeleting?: boolean };

export function ScenarioCard({ scenario, onDelete, isDeleting }: Props) {
  const { widthM, heightM, cellM } = scenario.config;
  return (
    <Card className="flex w-full flex-col gap-2.5 p-3.5 sm:w-[330px]">
      <MapView config={scenario.config} label={`Mapa de ${scenario.name}`} className="aspect-square w-full" />
      <h3 className="text-[15px] font-semibold">{scenario.name}</h3>
      <p className="font-mono text-xs text-ra-mut">{widthM} × {heightM} m · celdas {cellM} m</p>
      <div className="flex flex-wrap gap-2">
        <NavButton href="/mision" before={() => selectScenario(scenario.id)}>Usar</NavButton>
        <NavButton href={`/escenarios/editor/${scenario.id}`} tone="ghost">
          <Map className="size-4" /> Editar mapa
        </NavButton>
        {onDelete ? (
          <AppButton tone="danger" onPress={onDelete} isPending={isDeleting}>
            <Trash2 className="size-4" /> Eliminar
          </AppButton>
        ) : null}
      </div>
    </Card>
  );
}
