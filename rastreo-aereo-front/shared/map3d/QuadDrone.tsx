import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

const ARMS = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
] as const;

export function QuadDrone({ color, spinning }: { color: string; spinning: boolean }) {
  const rotors = useRef<(Group | null)[]>([]);

  useFrame((_, delta) => {
    if (!spinning) return;
    rotors.current.forEach((rotor) => rotor?.rotateY(delta * 30));
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[0.16, 0.07, 0.16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      {ARMS.map(([x, z], i) => (
        <group
          key={i}
          position={[x * 0.12, 0.04, z * 0.12]}
          ref={(node) => {
            rotors.current[i] = node;
          }}
        >
          <mesh>
            <boxGeometry args={[0.16, 0.008, 0.022]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
