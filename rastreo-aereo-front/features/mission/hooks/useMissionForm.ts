"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createRun } from "@/features/runs/services/run.service";
import { selectScenario } from "@/features/scenarios/services/scenario.service";
import { validateWithYup, type FieldErrors } from "@/shared/lib/validation";
import { missionSchema } from "../schemas/mission.schema";
import { DEFAULT_PARAMS, type ParamKey } from "../services/mission.rules";
import type { MissionData } from "./useMission";

export function useMissionForm(data: MissionData) {
  const router = useRouter();
  const [scenarioId, setScenarioId] = useState(data.selected.id);
  const [personId, setPersonId] = useState(data.persons[0]?.id ?? "");
  const [droneIds, setDroneIds] = useState(data.drones.map((d) => d.id));
  const [cameraIds, setCameraIds] = useState(data.cameras.map((c) => c.id));
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isStarting, setStarting] = useState(false);
  const scenario = data.scenarios.find((s) => s.id === scenarioId) ?? data.selected;

  const clear = (key: string) => setErrors((e) => ({ ...e, [key]: "" }));
  const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const start = async () => {
    const result = await validateWithYup(missionSchema, { personId, droneIds, cameraIds, ...params });
    if (!result.ok) return setErrors(result.errors);
    setStarting(true);
    const { drones, points, population, generations, seed } = result.values;
    const id = await createRun({ scenarioName: scenario.name, scenario: scenario.config, drones, points, population, generations, seed });
    router.push(`/corridas/${id}`);
  };

  return {
    scenario,
    setScenario: (id: string) => (setScenarioId(id), selectScenario(id)),
    personId,
    setPersonId: (id: string) => (setPersonId(id), clear("personId")),
    droneIds,
    toggleDrone: (id: string) => (setDroneIds((l) => toggle(l, id)), clear("droneIds")),
    cameraIds,
    toggleCamera: (id: string) => (setCameraIds((l) => toggle(l, id)), clear("cameraIds")),
    params,
    setParam: (key: ParamKey, value: string) => (setParams((p) => ({ ...p, [key]: value })), clear(key)),
    errors,
    start,
    isStarting,
  };
}

export type MissionForm = ReturnType<typeof useMissionForm>;
