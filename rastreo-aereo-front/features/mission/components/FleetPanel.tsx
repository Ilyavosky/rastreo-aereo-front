"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { MissionData } from "../hooks/useMission";
import type { MissionForm } from "../hooks/useMissionForm";
import { fleetKey } from "../services/fleet";
import { Stepper } from "./Stepper";

export function FleetPanel({ data, form }: { data: MissionData; form: MissionForm }) {
  const [openId, setOpenId] = useState(data.drones[0]?.id ?? "");

  return (
    <section aria-label="Flota" className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <h3 className="text-xs font-medium text-ra-mut">Flota</h3>
        <span aria-live="polite" className="font-mono text-xs font-medium text-ra-teal">{form.total} {form.total === 1 ? "dron" : "drones"}</span>
      </div>
      <ul className="divide-y divide-ra-line rounded-lg border border-ra-line">
        {data.drones.map((drone) => {
          const open = drone.id === openId;
          const subtotal = data.cameras.reduce((sum, camera) => sum + (form.fleet[fleetKey(drone.id, camera.id)] ?? 0), 0);
          const Chevron = open ? ChevronDown : ChevronRight;
          return (
            <li key={drone.id}>
              <button type="button" aria-expanded={open} onClick={() => setOpenId(open ? "" : drone.id)} className="flex w-full cursor-pointer items-center gap-2 px-2.5 py-2.5 text-left">
                <Chevron className="size-4 shrink-0 text-ra-mut" aria-hidden="true" />
                <span className="flex-1 text-[13px] font-medium">{drone.name}</span>
                <span className={`font-mono text-xs ${subtotal ? "" : "text-ra-mut"}`}>{subtotal}</span>
              </button>
              {open ? (
                <div className="ra-appear flex flex-col gap-2 pb-3 pl-8 pr-2.5">
                  <p className="font-mono text-[11px] text-ra-mut">{drone.batteryWh} Wh · {drone.vMin}–{drone.vMax} m/s · {drone.hMin}–{drone.hMax} m</p>
                  {data.cameras.map((camera) => (
                    <div key={camera.id} className="flex items-center justify-between gap-2">
                      <span className="text-[13px]" title={`FOV ${camera.fovDeg}° · ${camera.widthPx} px`}>{camera.name}</span>
                      <Stepper label={`${drone.name} con ${camera.name}`} value={form.fleet[fleetKey(drone.id, camera.id)] ?? 0} onChange={(count) => form.setCount(drone.id, camera.id, count)} />
                    </div>
                  ))}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
      {form.errors.drones ? <p role="alert" className="text-xs text-ra-red">{form.errors.drones}</p> : null}
    </section>
  );
}
