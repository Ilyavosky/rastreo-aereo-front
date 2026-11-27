import { Vector3 } from "three";
import type { Point } from "@/shared/types/domain";
import { densify, type Projector, type Vec3 } from "./terrain";

export function buildFlight(route: Point[], base: Point, projector: Projector, heightM: number) {
  const ground = densify([base, ...route, base], 15);
  const air: Vec3[] = [projector.place(base), ...ground.map((p) => projector.place(p, heightM)), projector.place(base)];
  const points = air.map((p) => new Vector3(...p));
  const distances = points.reduce<number[]>((list, p, i) => [...list, i ? list[i - 1] + p.distanceTo(points[i - 1]) : 0], []);

  return { air, points, distances, ground, shadow: ground.map((p) => projector.place(p, 3)) };
}

export function pointAt(flight: ReturnType<typeof buildFlight>, fraction: number, target: Vector3) {
  const { points, distances } = flight;
  const wanted = fraction * distances[distances.length - 1];
  const next = Math.max(1, distances.findIndex((d) => d >= wanted));
  const span = distances[next] - distances[next - 1] || 1;
  return target.lerpVectors(points[next - 1], points[next], (wanted - distances[next - 1]) / span);
}
