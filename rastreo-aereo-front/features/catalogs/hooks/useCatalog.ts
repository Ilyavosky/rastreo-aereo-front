"use client";

import { useCallback, useState } from "react";
import { useResource } from "@/shared/lib/useResource";
import type { CatalogItem, CatalogKind } from "../config/catalogs";
import { deleteCatalogItem, listCatalog } from "../services/catalog.service";

export function useCatalog(kind: CatalogKind) {
  const load = useCallback(() => listCatalog(kind), [kind]);
  const resource = useResource(load);
  const [form, setForm] = useState<{ item?: CatalogItem }>();
  const [deletingId, setDeletingId] = useState<string>();

  const remove = async (id: string) => {
    setDeletingId(id);
    await deleteCatalogItem(kind, id);
    setDeletingId(undefined);
    resource.reload();
  };

  return {
    ...resource,
    form,
    openCreate: () => setForm({}),
    openEdit: (item: CatalogItem) => setForm({ item }),
    closeForm: () => setForm(undefined),
    deletingId,
    remove,
  };
}
