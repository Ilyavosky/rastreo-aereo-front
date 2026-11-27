"use client";

import { Pause, Play } from "lucide-react";
import { useMemo, useState } from "react";
import { Pill } from "@/shared/components/Pill";
import { droneColor } from "@/shared/map/droneColor";
import { MapView } from "@/shared/map/MapView";
import { MapViewToggle } from "@/shared/map/MapViewToggle";
import { MAX_DRAWN_DRONES } from "@/shared/map/previewRoutes";
import { SquareFit } from "@/shared/map/SquareFit";
import { useMapView } from "@/shared/map/useMapView";
import { Map3D } from "@/shared/map3d/Map3D";
import { FLIGHT_HEIGHTS_M } from "@/shared/map3d/terrain";
import type { ScenarioConfig } from "@/shared/types/domain";
import { PROFILE_IDS, PROFILES, type ProfileId } from "../data/comparison";
import { exampleRoutes } from "../services/routes";

type Props = { config: ScenarioConfig; profileId: ProfileId; droneCount: number; points: number };

export function DetailMap({ config, profileId, droneCount, points }: Props) {
  const [swath, setSwath] = useState(true);
  const [priority, setPriority] = useState(false);
  const [flying, setFlying] = useState(true);
  const { isRelief } = useMapView();
  const { ga, drones: sample } = PROFILES[profileId];
  const routes = useMemo(
    () => exampleRoutes({ sample: ga.routes, config, drones: droneCount, points, variant: PROFILE_IDS.indexOf(profileId) }),
    [ga, config, droneCount, points, profileId],
  );
  const hasLog = droneCount === sample.length;
  const drones = hasLog ? sample : routes.map((_, i) => ({ name: `Dron ${i + 1}` }));
  const flightSeconds = useMemo(() => (hasLog ? sample.map((d) => d.time) : []), [hasLog, sample]);

  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      <MapViewToggle />
      <div className="flex flex-wrap items-center gap-2">
        {drones.map((d, i) => (
          <span key={d.name} className="rounded-full border border-ra-line bg-ra-panel px-2.5 py-1.5 text-xs font-medium" style={{ color: droneColor(i) }}>● {d.name}</span>
        ))}
        <Pill active={swath} onClick={() => setSwath((v) => !v)}>Franja de cobertura</Pill>
        <Pill active={priority} onClick={() => setPriority((v) => !v)}>Prioridad</Pill>
        <Pill active={flying} onClick={() => setFlying((v) => !v)}>
          <span className="flex items-center gap-1.5">
            {flying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />} Simular vuelo
          </span>
        </Pill>
      </div>
      {isRelief ? (
        <Map3D config={config} routes={routes} flightSeconds={flightSeconds} flying={flying} swath={swath} priority={priority} />
      ) : (
        <SquareFit>
          <MapView config={config} routes={routes} swath={swath} priority={priority} waypoints flying={flying} flightSeconds={flightSeconds} />
        </SquareFit>
      )}
      {hasLog ? (
        <div className="grid gap-2.5 sm:grid-cols-3">
          {sample.map((d, i) => (
            <div key={d.name} className="rounded-lg border bg-ra-panel p-3" style={{ borderColor: droneColor(i) }}>
              <h3 className="text-[13px] font-semibold" style={{ color: droneColor(i) }}>{d.name} · {d.drone}</h3>
              <p className="text-xs text-ra-mut">{d.camera}</p>
              <p className="font-mono text-xs">{d.time.toFixed(1)} min · {d.energy.toFixed(1)} Wh</p>
              {isRelief ? <p className="text-[11px] text-ra-mut">Altura de vuelo ilustrativa: {FLIGHT_HEIGHTS_M[i]} m</p> : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-ra-yellow">
          {droneCount > MAX_DRAWN_DRONES ? ` Solo se dibujan los primeros ${MAX_DRAWN_DRONES}.` : ""}
        </p>
      )}
    </div>
  );
}
