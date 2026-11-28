"use client";

import { ErrorState } from "@/shared/components/Feedback";
import { useMission, type MissionData } from "../hooks/useMission";
import { useMissionForm } from "../hooks/useMissionForm";
import { MapPanel } from "./MapPanel";
import { MissionSkeleton } from "./MissionSkeleton";
import { RunPanel } from "./RunPanel";
import { ScenarioPanel } from "./ScenarioPanel";

function MissionWorkspace({ data }: { data: MissionData }) {
  const form = useMissionForm(data);
  return (
    <div className="ra-stagger flex flex-1 flex-col lg:h-[calc(100dvh-60px)] lg:flex-row">
      <ScenarioPanel data={data} form={form} />
      <MapPanel scenario={form.scenario} drones={form.total} />
      <RunPanel form={form} />
    </div>
  );
}

export function MissionView() {
  const { data, error, isLoading, reload } = useMission();
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (isLoading || !data) return <MissionSkeleton />;
  return <MissionWorkspace data={data} />;
}
