"use client";

import { Plus } from "lucide-react";
import { EmptyState, ErrorState } from "@/shared/components/Feedback";
import { NavButton } from "@/shared/components/NavButton";
import { useScenarios } from "../hooks/useScenarios";
import { ScenarioCard } from "./ScenarioCard";
import { ScenariosSkeleton } from "./ScenariosSkeleton";

export function ScenariosView() {
  const { isLoading, error, reload, templates, own, remove, deletingId } = useScenarios();
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (isLoading) return <ScenariosSkeleton />;

  return (
    <div className="flex flex-col gap-[18px] p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Escenarios</h1>
        <NavButton href="/escenarios/editor/nuevo">
          <Plus className="size-4" /> Nuevo escenario
        </NavButton>
      </div>
      <h2 className="text-[13px] font-medium text-ra-mut">Plantillas (solo lectura, sirven como punto de partida)</h2>
      <div className="ra-stagger flex flex-wrap gap-4">
        {templates.map((item) => (
          <ScenarioCard key={item.id} scenario={item} />
        ))}
      </div>
      <h2 className="text-sm font-semibold">Mis escenarios</h2>
      {own.length === 0 ? (
        <EmptyState title="Aún no tienes escenarios">
          Al guardar desde el editor aparecen aquí, con opciones para editar y eliminar.
        </EmptyState>
      ) : (
        <div className="ra-stagger flex flex-wrap gap-4">
          {own.map((item) => (
            <ScenarioCard key={item.id} scenario={item} onDelete={() => remove(item.id)} isDeleting={deletingId === item.id} />
          ))}
        </div>
      )}
    </div>
  );
}
