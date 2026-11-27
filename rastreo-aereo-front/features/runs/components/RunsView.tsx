"use client";

import { EmptyState, ErrorState } from "@/shared/components/Feedback";
import { Pill } from "@/shared/components/Pill";
import { TableSkeleton } from "@/shared/components/Skeletons";
import { useRuns } from "../hooks/useRuns";
import type { RunStatus } from "../services/run.types";
import { RunsTable } from "./RunsTable";

const FILTERS: [RunStatus | "all", string][] = [
  ["all", "Todas"],
  ["queued", "En cola"],
  ["running", "En curso"],
  ["completed", "Completadas"],
  ["failed", "Fallidas"],
  ["cancelled", "Canceladas"],
];

export function RunsView() {
  const vm = useRuns();
  if (vm.error) return <ErrorState message={vm.error} onRetry={vm.reload} />;
  if (vm.isLoading) return <TableSkeleton />;

  return (
    <div className="flex flex-col gap-[18px] p-8">
      <h1 className="text-2xl font-semibold">Corridas</h1>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(([id, label]) => (
          <Pill key={id} active={vm.filter === id} onClick={() => vm.setFilter(id)}>{label}</Pill>
        ))}
      </div>
      {vm.visible.length === 0 ? (
        <EmptyState title={vm.filter === "all" ? "Aún no hay corridas" : "Sin resultados para este filtro"}>
          Inicia una optimización desde Misión.
        </EmptyState>
      ) : (
        <RunsTable runs={vm.visible} deletingId={vm.deletingId} onDelete={vm.remove} />
      )}
      <p className="text-xs text-ra-mut">Filas de ejemplo. Solo se pueden eliminar corridas terminadas.</p>
    </div>
  );
}
