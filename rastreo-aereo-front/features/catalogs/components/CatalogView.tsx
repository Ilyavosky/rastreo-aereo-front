"use client";

import { Plus } from "lucide-react";
import { AppButton } from "@/shared/components/AppButton";
import { EmptyState, ErrorState } from "@/shared/components/Feedback";
import { ModalFrame } from "@/shared/components/ModalFrame";
import { TableSkeleton } from "@/shared/components/Skeletons";
import { CATALOGS, type CatalogKind } from "../config/catalogs";
import { useCatalog } from "../hooks/useCatalog";
import { CatalogForm } from "./CatalogForm";
import { CatalogTable } from "./CatalogTable";
import { CatalogTabs } from "./CatalogTabs";

export function CatalogView({ kind }: { kind: CatalogKind }) {
  const vm = useCatalog(kind);
  const catalog = CATALOGS[kind];
  if (vm.error) return <ErrorState message={vm.error} onRetry={vm.reload} />;
  if (vm.isLoading || !vm.data) return <TableSkeleton />;

  return (
    <div className="flex flex-col gap-[18px] p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Catálogos</h1>
        <AppButton onPress={vm.openCreate}>
          <Plus className="size-4" /> {catalog.addLabel}
        </AppButton>
      </div>
      <CatalogTabs active={kind} />
      {vm.data.length === 0 ? (
        <EmptyState title="Sin registros">Agrega el primero con el botón de arriba.</EmptyState>
      ) : (
        <CatalogTable kind={kind} items={vm.data} deletingId={vm.deletingId} onEdit={vm.openEdit} onDelete={vm.remove} />
      )}
      <ModalFrame title={vm.form?.item ? catalog.editLabel : catalog.addLabel} isOpen={Boolean(vm.form)} onClose={vm.closeForm}>
        {vm.form ? (
          <CatalogForm
            kind={kind}
            item={vm.form.item}
            onCancel={vm.closeForm}
            onSaved={() => {
              vm.closeForm();
              vm.reload();
            }}
          />
        ) : null}
      </ModalFrame>
    </div>
  );
}
