"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveScenario, selectScenario } from "@/features/scenarios/services/scenario.service";
import { validateWithYup } from "@/shared/lib/validation";
import type { Scenario, ScenarioConfig } from "@/shared/types/domain";
import { scenarioSchema } from "../schemas/scenario.schema";
import { configProblem } from "../services/editor.rules";

export function useSaveScenario(scenario: Scenario | undefined, config: ScenarioConfig) {
  const router = useRouter();
  const [name, setName] = useState(scenario ? (scenario.isTemplate ? `${scenario.name} (copia)` : scenario.name) : "");
  const [nameError, setNameError] = useState("");
  const [failure, setFailure] = useState("");
  const [saving, setSaving] = useState<"save" | "use">();

  const save = async (then: "save" | "use") => {
    const result = await validateWithYup(scenarioSchema, { name });
    if (!result.ok) return setNameError(result.errors.name);
    const problem = configProblem(config);
    if (problem) return setFailure(problem);
    setFailure("");
    setSaving(then);
    try {
      const id = scenario && !scenario.isTemplate ? scenario.id : undefined;
      const saved = await saveScenario({ id, name: result.values.name, config });
      if (then === "use") selectScenario(saved.id);
      router.push(then === "use" ? "/mision" : "/escenarios");
    } catch (error) {
      setFailure(error instanceof Error ? error.message : "No se pudo guardar");
      setSaving(undefined);
    }
  };

  return {
    name,
    setName: (value: string) => (setName(value), setNameError(""), setFailure("")),
    nameError,
    failure,
    saving,
    save,
  };
}

export type SaveModel = ReturnType<typeof useSaveScenario>;
