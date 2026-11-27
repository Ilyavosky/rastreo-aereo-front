import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type ComponentRef } from "react";
import { Group, Vector3 } from "three";
import type { Point } from "@/shared/types/domain";
import { buildFlight, pointAt } from "./flight";
import { QuadDrone } from "./QuadDrone";
import { Swath } from "./Swath";
import type { Projector } from "./terrain";

const DRAW_SECONDS = 1.8;

function reveal(line: ComponentRef<typeof Line> | null, segments: number, fraction: number) {
  if (line) line.geometry.instanceCount = Math.ceil(segments * fraction);
}

type Props = {
  route: Point[];
  base: Point;
  projector: Projector;
  color: string;
  heightM: number;
  seconds: number;
  flying: boolean;
  swath?: boolean;
  draw: boolean;
};

export function DroneRoute({ route, base, projector, color, heightM, seconds, flying, swath, draw }: Props) {
  const flight = useMemo(() => buildFlight(route, base, projector, heightM), [route, base, projector, heightM]);
  const drone = useRef<Group>(null);
  const drop = useRef<Group>(null);
  const elapsed = useRef(0);
  const position = useRef(new Vector3());

  const airLine = useRef<ComponentRef<typeof Line>>(null);
  const groundLine = useRef<ComponentRef<typeof Line>>(null);
  const marks = useRef<Group>(null);
  const drawn = useRef(draw ? 0 : 1);

  useFrame((_, delta) => {
    drawn.current = Math.min(1, drawn.current + Math.min(delta, 0.05) / DRAW_SECONDS);
    reveal(airLine.current, flight.air.length - 1, drawn.current);
    reveal(groundLine.current, flight.shadow.length - 1, drawn.current);
    marks.current?.children.forEach((mark, i) => {
      mark.visible = drawn.current >= (i + 1) / (route.length + 1);
    });
    if (flying) elapsed.current += Math.min(delta, 0.1);
    const point = pointAt(flight, (elapsed.current % seconds) / seconds, position.current);
    drone.current?.position.copy(point);
    drop.current?.position.copy(point);
    drop.current?.scale.set(1, Math.max(0.01, heightM * projector.scale), 1);
  });

  return (
    <group>
      {swath ? <Swath ground={flight.ground} projector={projector} color={color} /> : null}
      <Line ref={groundLine} points={flight.shadow} color={color} lineWidth={1} transparent opacity={0.45} />
      <Line ref={airLine} points={flight.air} color={color} lineWidth={2.5} />
      <group ref={marks}>
        {route.map((p, i) => (
          <mesh key={i} position={projector.place(p, heightM)} visible={!draw}>
            <sphereGeometry args={[0.04, 10, 10]} />
            <meshBasicMaterial color={color} />
          </mesh>
        ))}
      </group>
      <group ref={drop}>
        <Line points={[[0, 0, 0], [0, -1, 0]]} color="#ffffff" lineWidth={1} transparent opacity={0.5} />
      </group>
      <group ref={drone}>
        <QuadDrone color={color} spinning={flying} />
      </group>
    </group>
  );
}
