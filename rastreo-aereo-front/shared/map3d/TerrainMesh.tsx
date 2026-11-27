import { useEffect, useMemo } from "react";
import { Color, PlaneGeometry, BufferAttribute } from "three";
import type { ScenarioConfig, VegetationType } from "@/shared/types/domain";
import { Cliffs } from "./Cliffs";
import { addContours } from "./contours";
import { EXAGGERATION, vegetationAt, type Projector } from "./terrain";

const GROUND: Record<VegetationType, string> = { open: "#4f7a54", brush: "#46744a", dense: "#2f5f3c" };
const SEGMENTS = 200;
const CONTOUR_M = 12;

type Props = { config: ScenarioConfig; projector: Projector; priority?: boolean };

function buildGeometry({ config, projector, priority }: Props) {
  const { widthM: w, heightM: h, lastSeen } = config;
  const geometry = new PlaneGeometry(projector.width, projector.depth, SEGMENTS, SEGMENTS);
  geometry.rotateX(-Math.PI / 2);
  const positions = geometry.getAttribute("position");
  const colors = new Float32Array(positions.count * 3);
  const high = new Color("#c2ad84");
  const hot = new Color("#f2c14e");

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i) / projector.scale + w / 2;
    const y = h / 2 - positions.getZ(i) / projector.scale;
    const elevation = projector.elevation(x, y);
    positions.setY(i, elevation * projector.scale);
    const color = new Color(GROUND[vegetationAt(config, { x, y })]);
    color.lerp(high, Math.min(0.85, elevation / 260));
    if (priority && lastSeen) {
      const reach = Math.max(w, h) * 0.28;
      color.lerp(hot, 0.55 * Math.max(0, 1 - Math.hypot(x - lastSeen.x, y - lastSeen.y) / reach));
    }
    color.toArray(colors, i * 3);
  }

  geometry.setAttribute("color", new BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

export function TerrainMesh({ config, projector, priority }: Props) {
  const geometry = useMemo(() => buildGeometry({ config, projector, priority }), [config, projector, priority]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <group>
      <mesh geometry={geometry} receiveShadow castShadow>
        <meshStandardMaterial vertexColors roughness={0.95} onBeforeCompile={addContours(CONTOUR_M * EXAGGERATION * projector.scale)} />
      </mesh>
      <Cliffs config={config} projector={projector} segments={SEGMENTS} />
    </group>
  );
}
