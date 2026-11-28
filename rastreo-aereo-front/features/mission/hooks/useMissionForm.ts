"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createRun } from "@/features/runs/services/run.service";
import { selectScenario } from "@/features/scenarios/services/scenario.service";
import { validateWithYup, type FieldErrors } from "@/shared/lib/validation";
import { missionSchema } from "../schemas/mission.schema";
import { assignments, defaultFleet, fleetKey } from "../services/fleet";
import { DEFAULT_PARAMS, type ParamKey } from "../services/mission.rules";
import type { MissionData } from "./useMission";

export function useMissionForm(data: MissionData) {
  const router = useRouter();
  const [source, setSource] = useState(data);
  const [scenarioId, setScenarioId] = useState(data.selected.id);
  const [personId, setPersonId] = useState(data.persons[0]?.id ?? "");
  const [fleet, setFleet] = useState(() => defaultFleet(data.drones, data.cameras));
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isStarting, setStarting] = useState(false);

  if (source !== data) {
    setSource(data);
    setScenarioId(data.selected.id);
    setStarting(false);
  }

  const scenario = data.scenarios.find((s) => s.id === scenarioId) ?? data.selected;

  const clear = (key: string) => setErrors((e) => ({ ...e, [key]: "" }));
  const assigned = assignments(fleet, data.drones, data.cameras);

  const start = async () => {
    const result = await validateWithYup(missionSchema, { personId, drones: assigned.length, ...params });
    if (!result.ok) return setErrors(result.errors);
    setStarting(true);
    const { drones, points, population, generations, seed } = result.values;
    const id = await createRun({ scenarioName: scenario.name, scenario: scenario.config, drones, fleet: assigned, points, population, generations, seed });
    router.push(`/corridas/${id}`);
  };

  return {
    scenario,
    setScenario: (id: string) => (setScenarioId(id), selectScenario(id)),
    personId,
    setPersonId: (id: string) => (setPersonId(id), clear("personId")),
    fleet,
    total: assigned.length,
    setCount: (droneId: string, cameraId: string, count: number) => (setFleet((f) => ({ ...f, [fleetKey(droneId, cameraId)]: count })), clear("drones")),
    params,
    setParam: (key: ParamKey, value: string) => (setParams((p) => ({ ...p, [key]: value })), clear(key)),
    errors,
    start,
    isStarting,
  };
}

export type MissionForm = ReturnType<typeof useMissionForm>;
