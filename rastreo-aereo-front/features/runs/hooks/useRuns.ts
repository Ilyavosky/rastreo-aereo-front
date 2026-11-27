"use client";

import { useEffect, useState } from "react";
import { useResource } from "@/shared/lib/useResource";
import { deleteRun, listRuns } from "../services/run.service";
import type { RunStatus } from "../services/run.types";

export function useRuns() {
  const resource = useResource(listRuns);
  const [filter, setFilter] = useState<RunStatus | "all">("all");
  const [deletingId, setDeletingId] = useState<string>();
  const { data, reload } = resource;
  const hasLive = data?.some((run) => run.status === "running" && run.startedAt);

  useEffect(() => {
    if (!hasLive) return;
    const timer = setTimeout(reload, 2000);
    return () => clearTimeout(timer);
  }, [hasLive, data, reload]);

  const remove = async (id: string) => {
    setDeletingId(id);
    await deleteRun(id);
    setDeletingId(undefined);
    reload();
  };

  return {
    ...resource,
    filter,
    setFilter,
    visible: data?.filter((run) => filter === "all" || run.status === filter) ?? [],
    deletingId,
    remove,
  };
}
