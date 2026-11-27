import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh, MeshBasicMaterial } from "three";
import type { Point, Rect, ScenarioConfig } from "@/shared/types/domain";
import { densify, type Projector } from "./terrain";

const FENCE_M = 60;

function ForbiddenZone({ zone, projector }: { zone: Rect; projector: Projector }) {
  const corners: Point[] = [
    { x: zone.x0, y: zone.y0 },
    { x: zone.x1, y: zone.y0 },
    { x: zone.x1, y: zone.y1 },
    { x: zone.x0, y: zone.y1 },
    { x: zone.x0, y: zone.y0 },
  ];
  const outline = densify(corners, 20);

  return (
    <group>
      {[3, FENCE_M].map((above) => (
        <Line key={above} points={outline.map((p) => projector.place(p, above))} color="#ff5d6c" lineWidth={2} />
      ))}
      {corners.slice(0, 4).map((p) => (
        <Line key={`${p.x}-${p.y}`} points={[projector.place(p), projector.place(p, FENCE_M)]} color="#ff5d6c" lineWidth={2} />
      ))}
    </group>
  );
}

function LastSeen({ point, projector, still }: { point: Point; projector: Projector; still: boolean }) {
  const ring = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const mesh = ring.current;
    if (!mesh || still) return;
    const t = (clock.elapsedTime % 1.8) / 1.8;
    mesh.scale.setScalar(1 + t * 2);
    (mesh.material as MeshBasicMaterial).opacity = 0.8 * (1 - t);
  });

  const [x, y, z] = projector.place(point, 6);

  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.11, 20, 20]} />
        <meshStandardMaterial color="#f2c14e" emissive="#f2c14e" emissiveIntensity={0.7} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[0.16, 0.2, 40]} />
        <meshBasicMaterial color="#f2c14e" transparent opacity={0.8} depthWrite={false} />
      </mesh>
    </group>
  );
}

export function Landmarks({ config, projector, still }: { config: ScenarioConfig; projector: Projector; still: boolean }) {
  return (
    <group>
      {config.paths.map((path, i) => (
        <Line
          key={i}
          points={densify(path.points, 15).map((p) => projector.place(p, 4))}
          color={path.kind === "river" ? "#4d9ae0" : "#d9c49a"}
          lineWidth={path.kind === "river" ? 7 : 2.5}
          dashed={path.kind === "trail"}
          dashSize={0.14}
          gapSize={0.1}
        />
      ))}
      {config.forbiddenZones.map((zone, i) => (
        <ForbiddenZone key={i} zone={zone} projector={projector} />
      ))}
      {config.base ? (
        <mesh position={projector.place(config.base, 8)}>
          <boxGeometry args={[0.26, 0.14, 0.26]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ) : null}
      {config.lastSeen ? <LastSeen point={config.lastSeen} projector={projector} still={still} /> : null}
    </group>
  );
}
