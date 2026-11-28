import { useLayoutEffect, useMemo, useRef } from "react";
import { Color, InstancedMesh, Object3D } from "three";
import type { ScenarioConfig } from "@/shared/types/domain";
import { noise, vegetationAt, type Projector, type Vec3 } from "./terrain";

const DENSITY = { open: 0.02, brush: 0.3, dense: 0.85 };
const GRID = 52;
const GREENS = ["#2f7d46", "#3f9455", "#25693c", "#56a35c"];
const CLIFF_HILLS = 6;
const MAX_SLOPE = 0.75;

const slopeAt = ({ elevation }: Projector, { x, y }: { x: number; y: number }) =>
  Math.hypot(elevation(x + 10, y) - elevation(x - 10, y), elevation(x, y + 10) - elevation(x, y - 10)) / 20;

export function Trees({ config, projector }: { config: ScenarioConfig; projector: Projector }) {
  const mesh = useRef<InstancedMesh>(null);

  const trees = useMemo(() => {
    const list: { position: Vec3; size: number }[] = [];
    for (let i = 0; i < GRID * GRID; i++) {
      const point = {
        x: (((i % GRID) + noise(i)) / GRID) * config.widthM,
        y: ((Math.floor(i / GRID) + noise(i + 5000)) / GRID) * config.heightM,
      };
      const type = vegetationAt(config, point);
      if (noise(i + 9000) >= DENSITY[type]) continue;
      if (config.hills.length > CLIFF_HILLS && slopeAt(projector, point) > MAX_SLOPE) continue;
      const size = (type === "dense" ? 0.26 : 0.18) * (0.7 + noise(i + 100) * 0.6);
      list.push({ position: projector.place(point), size });
    }
    return list;
  }, [config, projector]);

  useLayoutEffect(() => {
    const dummy = new Object3D();
    trees.forEach(({ position, size }, i) => {
      dummy.position.set(position[0], position[1] + size / 2, position[2]);
      dummy.scale.set(size * 0.55, size, size * 0.55);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(i, dummy.matrix);
      mesh.current?.setColorAt(i, new Color(GREENS[i % GREENS.length]));
    });
    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true;
      if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    }
  }, [trees]);

  if (!trees.length) return null;

  return (
    <instancedMesh key={trees.length} ref={mesh} args={[undefined, undefined, trees.length]} castShadow>
      <coneGeometry args={[0.55, 1, 7]} />
      <meshStandardMaterial flatShading />
    </instancedMesh>
  );
}
