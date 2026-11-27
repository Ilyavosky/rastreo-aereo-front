"use client";

import { Box, Map as MapIcon, Pause, Play } from "lucide-react";
import { useState } from "react";
import { Pill } from "@/shared/components/Pill";
import { DRONE_COLORS } from "@/shared/map/MapRoutes";
import { MapView } from "@/shared/map/MapView";
import { SquareFit } from "@/shared/map/SquareFit";
import { Map3D } from "@/shared/map3d/Map3D";
import { FLIGHT_HEIGHTS_M } from "@/shared/map3d/terrain";
import type { ScenarioConfig } from "@/shared/types/domain";
import { PROFILES, type ProfileId } from "../data/comparison";

export function DetailMap({ config, profileId }: { config: ScenarioConfig; profileId: ProfileId }) {
  const [swath, setSwath] = useState(true);
  const [priority, setPriority] = useState(false);
  const [flying, setFlying] = useState(true);
  const [relief, setRelief] = useState(false);
  const { ga, drones } = PROFILES[profileId];
  const flightSeconds = drones.map((d) => d.time);

  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <Pill active={!relief} onClick={() => setRelief(false)}>
          <span className="flex items-center gap-1.5"><MapIcon className="size-3.5" /> Mapa 2D</span>
        </Pill>
        <Pill active={relief} onClick={() => setRelief(true)}>
          <span className="flex items-center gap-1.5"><Box className="size-3.5" /> Relieve 3D</span>
        </Pill>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {drones.map((d, i) => (
          <span key={d.name} className="rounded-full border border-ra-line bg-ra-panel px-2.5 py-1.5 text-xs font-medium" style={{ color: DRONE_COLORS[i] }}>● {d.name}</span>
        ))}
        <Pill active={swath} onClick={() => setSwath((v) => !v)}>Franja de cobertura</Pill>
        <Pill active={priority} onClick={() => setPriority((v) => !v)}>Prioridad</Pill>
        <Pill active={flying} onClick={() => setFlying((v) => !v)}>
          <span className="flex items-center gap-1.5">
            {flying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />} Simular vuelo
          </span>
        </Pill>
      </div>
      {relief ? (
        <Map3D config={config} routes={ga.routes} flightSeconds={flightSeconds} flying={flying} swath={swath} priority={priority} />
      ) : (
        <SquareFit>
          <MapView config={config} routes={ga.routes} swath={swath} priority={priority} waypoints flying={flying} flightSeconds={flightSeconds} />
        </SquareFit>
      )}
      <div className="grid gap-2.5 sm:grid-cols-3">
        {drones.map((d, i) => (
          <div key={d.name} className="rounded-lg border bg-ra-panel p-3" style={{ borderColor: DRONE_COLORS[i] }}>
            <h3 className="text-[13px] font-semibold" style={{ color: DRONE_COLORS[i] }}>{d.name} · {d.drone}</h3>
            <p className="text-xs text-ra-mut">{d.camera}</p>
            <p className="font-mono text-xs">{d.time.toFixed(1)} min · {d.energy.toFixed(1)} Wh</p>
            {relief ? <p className="text-[11px] text-ra-mut">Altura de vuelo ilustrativa: {FLIGHT_HEIGHTS_M[i]} m</p> : null}
          </div>
        ))}
      </div>
      <p className="text-[11px] text-ra-mut">Rutas y reparto por dron de ejemplo.</p>
    </div>
  );
}
