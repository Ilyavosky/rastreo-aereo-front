"use client";

import { Play } from "lucide-react";
import { AppButton } from "@/shared/components/AppButton";
import { FormInput } from "@/shared/components/FormInput";
import type { MissionForm } from "../hooks/useMissionForm";
import { genesPerIndividual, type ParamKey } from "../services/mission.rules";

export function RunPanel({ form }: { form: MissionForm }) {
  const input = (key: ParamKey, label: string) => (
    <FormInput label={label} value={form.params[key]} error={form.errors[key]} onChange={(v) => form.setParam(key, v)} />
  );
  const genes = genesPerIndividual(form.total, Number(form.params.points) || 0);
  const evaluations = (Number(form.params.population) || 0) * (Number(form.params.generations) || 0);

  return (
    <aside className="flex shrink-0 flex-col gap-3.5 overflow-y-auto bg-ra-panel p-5 lg:w-80">
      <h2 className="text-[15px] font-semibold">Corrida</h2>
      <div className="flex gap-2">{input("points", "Puntos por dron (K)")}</div>
      <div className="flex gap-2">{input("population", "Población")}{input("generations", "Generaciones")}</div>
      <h3 className="text-xs font-medium text-ra-mut">Operadores</h3>
      <div className="flex gap-2">{input("crossover", "Cruce SBX")}{input("eta", "Eta")}{input("sigma", "Mutación σ")}</div>
      <div className="flex gap-2">{input("reserve", "Reserva batería (%)")}{input("separation", "Separación (m)")}</div>
      <div className="flex gap-2">{input("seed", "Semilla")}{input("randomFactor", "Factor azar")}</div>
      <div className="flex flex-col gap-1.5 rounded-lg border border-ra-line bg-background p-3 font-mono">
        <span className="text-[13px] font-medium text-ra-teal">{genes} genes por individuo</span>
        <span className="text-[11px] text-ra-mut">D = {form.total} · D·K·4 + 2·D · {evaluations} evaluaciones</span>
      </div>
      <div className="mt-auto flex flex-col pt-2">
        <AppButton fullWidth onPress={form.start} isPending={form.isStarting}>
          {form.isStarting ? null : <Play className="size-4" />} Iniciar optimización
        </AppButton>
      </div>
    </aside>
  );
}
