"use client";

import { Redo2, Undo2, ZoomIn, ZoomOut } from "lucide-react";
import { useState, type PointerEvent } from "react";
import { AppButton } from "@/shared/components/AppButton";
import { MapView } from "@/shared/map/MapView";
import type { EditorModel } from "../hooks/useEditor";
import { EditorOverlay } from "./EditorOverlay";

function hintFor({ config, tool }: EditorModel) {
  if (!config.base) return "Paso 1: coloca la base haciendo clic en el mapa";
  if (tool === "trail" || tool === "river") return "Haz clic para agregar puntos y pulsa Terminar línea";
  if (!config.hills.length && !config.paths.length && !config.vegetationZones.length) return "Paso 2: agrega relieve, vegetación y ríos";
  return "Paso 3: marca zonas prohibidas y guarda";
}

export function EditorCanvas({ editor }: { editor: EditorModel }) {
  const [zoom, setZoom] = useState(1);
  const { preview } = editor;

  const toModel = (event: PointerEvent<SVGSVGElement>) => {
    const svg = event.currentTarget;
    const matrix = svg.getScreenCTM();
    if (!matrix) return { x: 0, y: 0 };
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return { x: p.x, y: preview.heightM - p.y };
  };

  return (
    <div className="flex min-h-[520px] min-w-0 flex-1 flex-col items-center gap-2.5 p-3.5">
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <p key={hintFor(editor)} className="ra-enter text-sm font-medium text-ra-yellow">{hintFor(editor)}</p>
        <div className="flex items-center gap-1 text-ra-mut">
          {editor.draft.length > 1 ? <AppButton onPress={editor.finishPath}>Terminar línea</AppButton> : null}
          <button type="button" aria-label="Deshacer" title="Deshacer" disabled={!editor.canUndo} onClick={editor.undo} className="cursor-pointer p-1.5 disabled:opacity-30"><Undo2 className="size-4" /></button>
          <button type="button" aria-label="Rehacer" title="Rehacer" disabled={!editor.canRedo} onClick={editor.redo} className="cursor-pointer p-1.5 disabled:opacity-30"><Redo2 className="size-4" /></button>
          <button type="button" aria-label="Alejar" onClick={() => setZoom((z) => Math.max(1, z - 0.25))} className="cursor-pointer p-1.5"><ZoomOut className="size-4" /></button>
          <span className="w-10 text-center font-mono text-xs">{Math.round(zoom * 100)}%</span>
          <button type="button" aria-label="Acercar" onClick={() => setZoom((z) => Math.min(3, z + 0.25))} className="cursor-pointer p-1.5"><ZoomIn className="size-4" /></button>
        </div>
      </div>
      <div className="relative w-full flex-1">
        <div className="absolute inset-0 overflow-auto">
          <div className="transition-[width,height] duration-200 motion-reduce:transition-none" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}>
            <MapView
              config={preview}
              label="Lienzo del editor de mapa"
              className="size-full cursor-crosshair touch-none"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                editor.down(toModel(e));
              }}
              onPointerMove={(e) => editor.move(toModel(e))}
              onPointerUp={editor.up}
            >
              <EditorOverlay editor={editor} />
            </MapView>
          </div>
        </div>
      </div>
      <p className="font-mono text-[11px] text-ra-mut">x: 0 a {preview.widthM} m · y: 0 a {preview.heightM} m · cuadrícula visual</p>
    </div>
  );
}
