import type { Assignment } from "@/features/runs/services/run.types";

export type Fleet = Record<string, number>;

type Named = { id: string; name: string };

export const DEFAULT_FLEET_SIZE = 3;

export const fleetKey = (droneId: string, cameraId: string) => `${droneId}:${cameraId}`;

export function defaultFleet(drones: Named[], cameras: Named[]): Fleet {
  const fleet: Fleet = {};
  if (!cameras.length) return fleet;
  for (let i = 0; i < DEFAULT_FLEET_SIZE && drones.length; i++) {
    const key = fleetKey(drones[i % drones.length].id, cameras[0].id);
    fleet[key] = (fleet[key] ?? 0) + 1;
  }
  return fleet;
}

export const assignments = (fleet: Fleet, drones: Named[], cameras: Named[]): Assignment[] =>
  drones.flatMap((drone) =>
    cameras.flatMap((camera) =>
      Array.from({ length: fleet[fleetKey(drone.id, camera.id)] ?? 0 }, () => ({ drone: drone.name, camera: camera.name })),
    ),
  );
