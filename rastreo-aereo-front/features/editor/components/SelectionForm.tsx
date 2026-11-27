"use client";

import { Trash2 } from "lucide-react";
import { AppButton } from "@/shared/components/AppButton";
import { FormSelect } from "@/shared/components/FormSelect";
import type { ScenarioConfig, VegetationType } from "@/shared/types/domain";
import type { EditorModel } from "../hooks/useEditor";
import { NumberInput } from "./NumberInput";

export const VEGETATION_OPTIONS = [
  { id: "open", label: "Abierta" },
  { id: "brush", label: "Matorral" },
  { id: "dense", label: "Densa" },
];

const TITLES = { base: "base", lastSeen: "último avistamiento", vegetation: "vegetación", forbidden: "zona prohibida", hill: "colina", path: "línea" };
const RECT_KEYS = ["x0", "y0", "x1", "y1"] as const;

export function SelectionForm({ editor }: { editor: EditorModel }) {
  const { selection, config, change } = editor;
  if (!selection) {
    return <p className="text-xs text-ra-mut">Nada seleccionado. La base es obligatoria y no puede quedar dentro de una zona prohibida.</p>;
  }

  const patch = <K extends "vegetationZones" | "forbiddenZones" | "hills">(key: K, index: number, values: Partial<ScenarioConfig[K][number]>) =>
    change((c) => ({ ...c, [key]: c[key].map((item, i) => (i === index ? { ...item, ...values } : item)) }));

  let fields = null;
  if (selection.kind === "base" || selection.kind === "lastSeen") {
    const key = selection.kind;
    const point = config[key];
    if (point) {
      fields = (["x", "y"] as const).map((axis) => (
        <NumberInput key={`${key}-${axis}`} label={axis} value={point[axis]} onCommit={(v) => change((c) => ({ ...c, [key]: { ...point, [axis]: v } }))} />
      ));
    }
  } else if (selection.kind === "forbidden" || selection.kind === "vegetation") {
    const key = selection.kind === "forbidden" ? "forbiddenZones" : "vegetationZones";
    const zone = config[key][selection.index];
    if (zone) {
      fields = RECT_KEYS.map((k) => (
        <NumberInput key={`${key}-${selection.index}-${k}`} label={k} value={zone[k]} onCommit={(v) => patch(key, selection.index, { [k]: v })} />
      ));
    }
  } else if (selection.kind === "hill") {
    const hill = config.hills[selection.index];
    if (hill) {
      fields = ([["x", "x"], ["y", "y"], ["heightM", "Altura (m)"], ["sigmaM", "Sigma (m)"]] as const).map(([k, label]) => (
        <NumberInput key={`hill-${selection.index}-${k}`} label={label} value={hill[k]} onCommit={(v) => patch("hills", selection.index, { [k]: v })} />
      ));
    }
  }

  const zone = selection.kind === "vegetation" ? config.vegetationZones[selection.index] : undefined;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[13px] font-semibold text-ra-acc">Seleccionado: {TITLES[selection.kind]}</h3>
      {fields ? <div className="grid grid-cols-2 gap-2">{fields}</div> : null}
      {zone && selection.kind === "vegetation" ? (
        <FormSelect label="Tipo" value={zone.type} options={VEGETATION_OPTIONS} onChange={(v) => patch("vegetationZones", selection.index, { type: v as VegetationType })} />
      ) : null}
      <AppButton tone="ghost" fullWidth onPress={editor.remove}>
        <Trash2 className="size-4" /> Eliminar elemento
      </AppButton>
    </div>
  );
}
