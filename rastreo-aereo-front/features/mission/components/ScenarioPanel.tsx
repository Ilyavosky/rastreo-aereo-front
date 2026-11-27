"use client";

import { FormSelect } from "@/shared/components/FormSelect";
import type { MissionData } from "../hooks/useMission";
import type { MissionForm } from "../hooks/useMissionForm";
import { EquipmentCheck } from "./EquipmentCheck";

const Title = ({ children }: { children: string }) => <h3 className="text-xs font-medium text-ra-mut">{children}</h3>;
const Problem = ({ text }: { text?: string }) => (text ? <p role="alert" className="text-xs text-ra-red">{text}</p> : null);

export function ScenarioPanel({ data, form }: { data: MissionData; form: MissionForm }) {
  return (
    <aside className="flex shrink-0 flex-col gap-3.5 overflow-y-auto bg-ra-panel p-5 lg:w-80">
      <h2 className="text-[15px] font-semibold">Escenario</h2>
      <FormSelect label="Escenario o plantilla" value={form.scenario.id} options={data.scenarios.map((s) => ({ id: s.id, label: s.name }))} onChange={form.setScenario} />
      <FormSelect label="Persona buscada" value={form.personId} error={form.errors.personId} options={data.persons.map((p) => ({ id: p.id, label: `${p.name} · ${p.criticalDimM} m` }))} onChange={form.setPersonId} />
      <Title>Drones elegibles</Title>
      {data.drones.map((d) => (
        <EquipmentCheck key={d.id} name={d.name} detail={`${d.batteryWh} Wh · ${d.vMin}–${d.vMax} m/s · ${d.hMin}–${d.hMax} m`} checked={form.droneIds.includes(d.id)} onToggle={() => form.toggleDrone(d.id)} />
      ))}
      <Problem text={form.errors.droneIds} />
      <Title>Cámaras elegibles</Title>
      {data.cameras.map((c) => (
        <EquipmentCheck key={c.id} name={c.name} detail={`FOV ${c.fovDeg}° · ${c.widthPx} px`} checked={form.cameraIds.includes(c.id)} onToggle={() => form.toggleCamera(c.id)} />
      ))}
      <Problem text={form.errors.cameraIds} />
    </aside>
  );
}
