"use client";

import { listEquipment } from "@/features/catalogs";
import { getSelectedScenario, listScenarios } from "@/features/scenarios/services/scenario.service";
import { useResource } from "@/shared/lib/useResource";

async function loadMission() {
  const [scenarios, selected, equipment] = await Promise.all([listScenarios(), getSelectedScenario(), listEquipment()]);
  return { scenarios, selected, ...equipment };
}

export type MissionData = Awaited<ReturnType<typeof loadMission>>;

export const useMission = () => useResource(loadMission);
