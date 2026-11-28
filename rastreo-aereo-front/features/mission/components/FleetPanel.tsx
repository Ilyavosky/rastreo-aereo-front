"use client";

import type { MissionData } from "../hooks/useMission";
import type { MissionForm } from "../hooks/useMissionForm";
import { fleetKey } from "../services/fleet";
import { Stepper } from "./Stepper";

const plural = (count: number) => `${count} ${count === 1 ? "dron" : "drones"}`;

export function FleetPanel({ data, form }: { data: MissionData; form: MissionForm }) {
  return (
    <section aria-label="Flota" className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-ra-mut">Flota</h3>
        <span aria-live="polite" className="rounded-full bg-ra-panel2 px-2.5 py-1 font-mono text-xs font-medium text-ra-teal">{plural(form.total)} en total</span>
      </div>
      {data.drones.map((drone) => {
        const subtotal = data.cameras.reduce((sum, camera) => sum + (form.fleet[fleetKey(drone.id, camera.id)] ?? 0), 0);
        return (
          <article key={drone.id} className={`overflow-hidden rounded-lg border ${subtotal ? "border-ra-teal" : "border-ra-line"}`}>
            <header className="flex items-start justify-between gap-2 bg-ra-panel2 px-2.5 py-2">
              <div className="flex flex-col">
                <h4 className="text-[13px] font-semibold">{drone.name}</h4>
                <span className="font-mono text-[11px] text-ra-mut">{drone.batteryWh} Wh · {drone.vMin}–{drone.vMax} m/s · {drone.hMin}–{drone.hMax} m</span>
              </div>
              <span className={`shrink-0 font-mono text-xs ${subtotal ? "text-ra-teal" : "text-ra-mut"}`}>{plural(subtotal)}</span>
            </header>
            <ul className="divide-y divide-ra-line">
              {data.cameras.map((camera) => (
                <li key={camera.id} className="flex items-center justify-between gap-2 px-2.5 py-1.5">
                  <div className="flex min-w-0 flex-col">
                    <span className="text-[13px]">{camera.name}</span>
                    <span className="font-mono text-[11px] text-ra-mut">FOV {camera.fovDeg}° · {camera.widthPx} px</span>
                  </div>
                  <Stepper label={`${drone.name} con ${camera.name}`} value={form.fleet[fleetKey(drone.id, camera.id)] ?? 0} onChange={(count) => form.setCount(drone.id, camera.id, count)} />
                </li>
              ))}
            </ul>
          </article>
        );
      })}
      {form.errors.drones ? <p role="alert" className="text-xs text-ra-red">{form.errors.drones}</p> : null}
    </section>
  );
}
