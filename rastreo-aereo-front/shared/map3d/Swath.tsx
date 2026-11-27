import { useEffect, useMemo } from "react";
import { BufferGeometry, DoubleSide, Float32BufferAttribute } from "three";
import type { Point } from "@/shared/types/domain";
import type { Projector } from "./terrain";

const HALF_WIDTH_M = 40;

function buildRibbon(ground: Point[], projector: Projector) {
  const vertices = ground.flatMap((point, i) => {
    const before = ground[i - 1] ?? point;
    const after = ground[i + 1] ?? point;
    const length = Math.hypot(after.x - before.x, after.y - before.y) || 1;
    const nx = (-(after.y - before.y) / length) * HALF_WIDTH_M;
    const ny = ((after.x - before.x) / length) * HALF_WIDTH_M;
    return [...projector.place({ x: point.x + nx, y: point.y + ny }, 2), ...projector.place({ x: point.x - nx, y: point.y - ny }, 2)];
  });
  const indices = ground.slice(1).flatMap((_, i) => [i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2]);

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  return geometry;
}

export function Swath({ ground, projector, color }: { ground: Point[]; projector: Projector; color: string }) {
  const geometry = useMemo(() => buildRibbon(ground, projector), [ground, projector]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={color} transparent opacity={0.2} depthWrite={false} side={DoubleSide} />
    </mesh>
  );
}
