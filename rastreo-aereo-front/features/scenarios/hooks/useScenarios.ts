"use client";

import { useState } from "react";
import { useResource } from "@/shared/lib/useResource";
import { deleteScenario, listScenarios } from "../services/scenario.service";

export function useScenarios() {
  const resource = useResource(listScenarios);
  const [deletingId, setDeletingId] = useState<string>();

  const remove = async (id: string) => {
    setDeletingId(id);
    await deleteScenario(id);
    setDeletingId(undefined);
    resource.reload();
  };

  return {
    ...resource,
    templates: resource.data?.filter((item) => item.isTemplate) ?? [],
    own: resource.data?.filter((item) => !item.isTemplate) ?? [],
    deletingId,
    remove,
  };
}
