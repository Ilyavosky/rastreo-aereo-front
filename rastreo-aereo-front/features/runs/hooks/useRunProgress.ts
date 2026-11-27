"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useResource } from "@/shared/lib/useResource";
import { cancelRun, getRun, peekRun } from "../services/run.service";
import type { Run } from "../services/run.types";

export function useRunProgress(id: string) {
  const router = useRouter();
  const load = useCallback(() => getRun(id), [id]);
  const { data, error, isLoading, reload } = useResource(load);
  const [live, setLive] = useState<Run>();
  const [isCancelling, setCancelling] = useState(false);
  const run = live?.id === id ? live : data;
  const isSimulating = run?.status === "running" && Boolean(run.startedAt);

  useEffect(() => {
    if (!isSimulating || isCancelling) return;
    const timer = setInterval(() => {
      const next = peekRun(id);
      if (!next) return;
      setLive(next);
      if (next.status === "completed") router.push(`/corridas/${id}/resultados`);
    }, 200);
    return () => clearInterval(timer);
  }, [id, isSimulating, isCancelling, router]);

  const cancel = async () => {
    setCancelling(true);
    await cancelRun(id);
    router.push("/mision");
  };

  return { run, error, isLoading, reload, cancel, isCancelling };
}
