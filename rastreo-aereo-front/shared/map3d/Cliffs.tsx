import { useEffect, useMemo } from "react";
import { BufferGeometry, Color, Float32BufferAttribute } from "three";
import type { Point, ScenarioConfig } from "@/shared/types/domain";
import type { Projector } from "./terrain";

const BASE_DEPTH = 0.35;
const ROWS = 12;

function buildWalls({ widthM: w, heightM: h }: ScenarioConfig, projector: Projector, segments: number) {
  const sides: { at: (t: number) => Point; normal: [number, number, number] }[] = [
    { at: (t) => ({ x: t * w, y: 0 }), normal: [0, 0, 1] },
    { at: (t) => ({ x: w, y: t * h }), normal: [1, 0, 0] },
    { at: (t) => ({ x: (1 - t) * w, y: h }), normal: [0, 0, -1] },
    { at: (t) => ({ x: 0, y: (1 - t) * h }), normal: [-1, 0, 0] },
  ];
  const deep = new Color("#2e211a");
  const earth = new Color("#6b5138");
  const rock = new Color("#a08a66");

  const positions: number[] = [];
  const normals: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  sides.forEach(({ at, normal }) => {
    const offset = positions.length / 3;
    for (let i = 0; i <= segments; i++) {
      const [x, top, z] = projector.place(at(i / segments));
      for (let row = 0; row <= ROWS; row++) {
        const y = top - ((top + BASE_DEPTH) * row) / ROWS;
        positions.push(x, y, z);
        normals.push(...normal);
        const level = Math.min(1, Math.max(0, (y + BASE_DEPTH) / 2.2));
        const color = level < 0.4 ? deep.clone().lerp(earth, level / 0.4) : earth.clone().lerp(rock, (level - 0.4) / 0.6);
        color.multiplyScalar(row % 3 === 2 ? 0.68 : 1);
        if (row === 0) color.set("#4f7a54");
        colors.push(color.r, color.g, color.b);
      }
    }
    for (let i = 0; i < segments; i++) {
      for (let row = 0; row < ROWS; row++) {
        const a = offset + i * (ROWS + 1) + row;
        const b = a + ROWS + 1;
        indices.push(a, a + 1, b + 1, a, b + 1, b);
      }
    }
  });

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new Float32BufferAttribute(normals, 3));
  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  return geometry;
}

export function Cliffs({ config, projector, segments }: { config: ScenarioConfig; projector: Projector; segments: number }) {
  const geometry = useMemo(() => buildWalls(config, projector, segments), [config, projector, segments]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial vertexColors roughness={1} emissive="#3a2819" emissiveIntensity={0.45} />
    </mesh>
  );
}
