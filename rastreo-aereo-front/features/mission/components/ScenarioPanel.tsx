"use client";

import { FormSelect } from "@/shared/components/FormSelect";
import type { MissionData } from "../hooks/useMission";
import type { MissionForm } from "../hooks/useMissionForm";
import { FleetPanel } from "./FleetPanel";

export function ScenarioPanel({ data, form }: { data: MissionData; form: MissionForm }) {
  return (
    <aside className="flex shrink-0 flex-col gap-3.5 overflow-y-auto bg-ra-panel p-5 lg:w-80">
      <h2 className="text-[15px] font-semibold">Escenario</h2>
      <FormSelect label="Escenario o plantilla" value={form.scenario.id} options={data.scenarios.map((s) => ({ id: s.id, label: s.name }))} onChange={form.setScenario} />
      <FormSelect label="Persona buscada" value={form.personId} error={form.errors.personId} options={data.persons.map((p) => ({ id: p.id, label: `${p.name} · ${p.criticalDimM} m` }))} onChange={form.setPersonId} />
      <FleetPanel data={data} form={form} />
    </aside>
  );
}
