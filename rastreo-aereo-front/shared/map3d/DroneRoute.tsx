import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group, Vector3 } from "three";
import type { Point } from "@/shared/types/domain";
import { buildFlight, pointAt } from "./flight";
import { QuadDrone } from "./QuadDrone";
import { Swath } from "./Swath";
import type { Projector } from "./terrain";

type Props = {
  route: Point[];
  base: Point;
  projector: Projector;
  color: string;
  heightM: number;
  seconds: number;
  flying: boolean;
  swath?: boolean;
};

export function DroneRoute({ route, base, projector, color, heightM, seconds, flying, swath }: Props) {
  const flight = useMemo(() => buildFlight(route, base, projector, heightM), [route, base, projector, heightM]);
  const drone = useRef<Group>(null);
  const drop = useRef<Group>(null);
  const elapsed = useRef(seconds * 0.15);
  const position = useRef(new Vector3());

  useFrame((_, delta) => {
    if (flying) elapsed.current += Math.min(delta, 0.1);
    const point = pointAt(flight, (elapsed.current % seconds) / seconds, position.current);
    drone.current?.position.copy(point);
    drop.current?.position.copy(point);
    drop.current?.scale.set(1, Math.max(0.01, heightM * projector.scale), 1);
  });

  return (
    <group>
      {swath ? <Swath ground={flight.ground} projector={projector} color={color} /> : null}
      <Line points={flight.shadow} color={color} lineWidth={1} transparent opacity={0.45} />
      <Line points={flight.air} color={color} lineWidth={2.5} />
      {route.map((p, i) => (
        <mesh key={i} position={projector.place(p, heightM)}>
          <sphereGeometry args={[0.04, 10, 10]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
      <group ref={drop}>
        <Line points={[[0, 0, 0], [0, -1, 0]]} color="#ffffff" lineWidth={1} transparent opacity={0.5} />
      </group>
      <group ref={drone}>
        <QuadDrone color={color} spinning={flying} />
      </group>
    </group>
  );
}
