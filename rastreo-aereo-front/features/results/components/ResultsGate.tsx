"use client";

import type { ReactNode } from "react";
import type { Run } from "@/features/runs";
import { ErrorState } from "@/shared/components/Feedback";
import { NavButton } from "@/shared/components/NavButton";

type Props = {
  run?: Run;
  error?: string;
  isLoading: boolean;
  reload: () => void;
  skeleton: ReactNode;
  children: (run: Run) => ReactNode;
};

export function ResultsGate({ run, error, isLoading, reload, skeleton, children }: Props) {
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (isLoading || !run) return <>{skeleton}</>;
  if (run.status !== "completed") {
    return (
      <div className="flex flex-col items-center gap-3 p-10">
        <p className="text-sm">Esta corrida todavía no tiene resultados.</p>
        <NavButton href="/corridas">Volver a corridas</NavButton>
      </div>
    );
  }
  return <>{children(run)}</>;
}
