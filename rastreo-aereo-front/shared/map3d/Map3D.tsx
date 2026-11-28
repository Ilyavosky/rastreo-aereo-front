"use client";

import { Spinner } from "@heroui/react";
import { Box, RotateCcw } from "lucide-react";
import dynamic from "next/dynamic";
import { Component, useState, type ReactNode } from "react";
import { reliefExaggeration } from "./terrain";
import type { Scene3DProps } from "./Scene3D";

function Notice({ children }: { children: ReactNode }) {
  return <div className="flex size-full flex-col items-center justify-center gap-3 p-6 text-center text-sm text-ra-mut">{children}</div>;
}

const Scene3D = dynamic(() => import("./Scene3D"), {
  ssr: false,
  loading: () => (
    <Notice>
      <div role="status" className="flex flex-col items-center gap-3">
        <Spinner /> Cargando relieve 3D…
      </div>
    </Notice>
  ),
});

function Unsupported() {
  return (
    <Notice>
      <Box className="size-6" /> No se pudo mostrar la vista 3D. Revisa que tu navegador tenga activada la aceleración gráfica o usa la vista 2D.
    </Notice>
  );
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return <Unsupported />;
  }
}

export function Map3D(props: Scene3DProps) {
  const [view, setView] = useState(0);
  const exaggeration = reliefExaggeration(props.config);
  const [supported] = useState(() => typeof document !== "undefined" && Boolean(document.createElement("canvas").getContext("webgl2")));

  return (
    <div className="relative min-h-[480px] w-full flex-1 overflow-hidden rounded-lg border border-ra-line bg-background">
      <div className="absolute inset-0" role="img" aria-label="Relieve en 3D del escenario">
        {supported ? (
          <SceneBoundary>
            <Scene3D key={view} {...props} />
          </SceneBoundary>
        ) : (
          <Unsupported />
        )}
      </div>
      <button type="button" onClick={() => setView((v) => v + 1)} className="absolute right-2 top-2 flex cursor-pointer items-center gap-1.5 rounded-lg border border-ra-line bg-ra-panel px-2.5 py-1.5 text-xs font-medium">
        <RotateCcw className="size-3.5" /> Restablecer vista
      </button>
      <p className="pointer-events-none absolute inset-x-0 bottom-0 bg-background/85 px-2 py-1.5 text-center text-[11px] text-ra-mut">
        Arrastra para girar · rueda para acercar · clic derecho para mover · {exaggeration > 1 ? `relieve exagerado ×${exaggeration}` : "relieve sin exagerar"}
      </p>
    </div>
  );
}
