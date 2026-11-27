"use client";

import { useMemo } from "react";
import { MapView } from "@/shared/map/MapView";
import { MapViewToggle } from "@/shared/map/MapViewToggle";
import { parkingSpots, previewRoutes } from "@/shared/map/previewRoutes";
import { SquareFit } from "@/shared/map/SquareFit";
import { useMapView } from "@/shared/map/useMapView";
import { Map3D } from "@/shared/map3d/Map3D";
import type { Scenario } from "@/shared/types/domain";

const FLIGHT_SECONDS: number[] = [];

export function MapPanel({ scenario, drones, points }: { scenario: Scenario; drones: number; points: number }) {
  const { isRelief } = useMapView();
  const routes = useMemo(() => previewRoutes(scenario.config, drones, points), [scenario.config, drones, points]);
  const parked = useMemo(() => parkingSpots(scenario.config, routes.length), [scenario.config, routes.length]);

  return (
    <div className="flex min-h-[520px] min-w-0 flex-1 flex-col items-center gap-3 p-4">
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Mapa del escenario · {scenario.name}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <MapViewToggle />
        </div>
      </div>
      {isRelief ? (
        <Map3D config={scenario.config} routes={routes} flightSeconds={FLIGHT_SECONDS} flying={false} parked={parked} priority />
      ) : (
        <SquareFit>
          <MapView config={scenario.config} routes={routes} priority waypoints parked={parked} />
        </SquareFit>
      )}
      <p className="font-mono text-xs text-ra-mut">□ base   ● último avistamiento   - - sendero   ━ río   ▨ zona prohibida   ◌ prioridad (solo visual)</p>
    </div>
  );
}
