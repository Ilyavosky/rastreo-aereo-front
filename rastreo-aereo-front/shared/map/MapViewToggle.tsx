"use client";

import { Box, Map as MapIcon } from "lucide-react";
import { Pill } from "@/shared/components/Pill";
import { useMapView } from "./useMapView";

export function MapViewToggle() {
  const { isRelief, setMode } = useMapView();

  return (
    <div className="flex items-center gap-2">
      <Pill active={!isRelief} onClick={() => setMode("2d")}>
        <span className="flex items-center gap-1.5"><MapIcon className="size-3.5" /> Mapa 2D</span>
      </Pill>
      <Pill active={isRelief} onClick={() => setMode("3d")}>
        <span className="flex items-center gap-1.5"><Box className="size-3.5" /> Relieve 3D</span>
      </Pill>
    </div>
  );
}
