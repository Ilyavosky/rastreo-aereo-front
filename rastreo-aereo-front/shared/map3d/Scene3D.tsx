"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { useMemo } from "react";
import { DRONE_COLORS } from "@/shared/map/MapRoutes";
import type { Point, ScenarioConfig } from "@/shared/types/domain";
import { DroneRoute } from "./DroneRoute";
import { Landmarks } from "./Landmarks";
import { createProjector, FLIGHT_HEIGHTS_M } from "./terrain";
import { TerrainMesh } from "./TerrainMesh";
import { Trees } from "./Trees";

export type Scene3DProps = {
  config: ScenarioConfig;
  routes: Point[][];
  flightSeconds: number[];
  flying: boolean;
  swath?: boolean;
  priority?: boolean;
};

export default function Scene3D({ config, routes, flightSeconds, flying, swath, priority }: Scene3DProps) {
  const projector = useMemo(() => createProjector(config), [config]);
  const reduce = Boolean(useReducedMotion());

  return (
    <Canvas
      shadows="percentage"
      camera={{ position: [0, 7, 9.2], fov: 42 }}
      dpr={[1, 2]}
      onCreated={({ camera, size }) => camera.position.multiplyScalar(Math.max(1, 1.55 / (size.width / size.height)))}
    >
      <color attach="background" args={["#0b1117"]} />
      <hemisphereLight args={["#bcd9ff", "#2a241c", 1.1]} />
      <directionalLight
        position={[7, 6, 3]}
        intensity={2.4}
        color="#ffe9c7"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <TerrainMesh config={config} projector={projector} priority={priority} />
      <Trees config={config} projector={projector} />
      <Landmarks config={config} projector={projector} still={reduce} />
      {config.base
        ? routes.map((route, i) => (
            <DroneRoute
              key={i}
              route={route}
              base={config.base!}
              projector={projector}
              color={DRONE_COLORS[i % DRONE_COLORS.length]}
              heightM={FLIGHT_HEIGHTS_M[i % FLIGHT_HEIGHTS_M.length]}
              seconds={flightSeconds[i] ?? 10}
              flying={flying && !reduce}
              swath={swath}
            />
          ))
        : null}
      <OrbitControls makeDefault enableDamping minDistance={4} maxDistance={22} maxPolarAngle={Math.PI / 2.15} />
    </Canvas>
  );
}
