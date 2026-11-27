"use client";

import { Play, Save } from "lucide-react";
import { AppButton } from "@/shared/components/AppButton";
import { FormInput } from "@/shared/components/FormInput";
import { FormSelect } from "@/shared/components/FormSelect";
import type { VegetationType } from "@/shared/types/domain";
import type { EditorModel } from "../hooks/useEditor";
import type { SaveModel } from "../hooks/useSaveScenario";
import { cellCount, MAX_CELLS } from "../services/editor.rules";
import { NumberInput } from "./NumberInput";
import { SelectionForm, VEGETATION_OPTIONS } from "./SelectionForm";

export function PropertiesPanel({ editor, saver }: { editor: EditorModel; saver: SaveModel }) {
  const { config, change } = editor;
  const cells = cellCount(config);

  return (
    <aside className="flex shrink-0 flex-col gap-3 overflow-y-auto bg-ra-panel p-4 lg:w-[300px]">
      <h2 className="text-sm font-semibold">Escenario</h2>
      <FormInput label="Nombre" required placeholder="Sin nombre" value={saver.name} error={saver.nameError} onChange={saver.setName} />
      <div className="flex gap-2">
        <NumberInput label="Ancho (m)" value={config.widthM} onCommit={(v) => change((c) => ({ ...c, widthM: v }))} />
        <NumberInput label="Alto (m)" value={config.heightM} onCommit={(v) => change((c) => ({ ...c, heightM: v }))} />
      </div>
      <div className="flex gap-2">
        <NumberInput label="Celda (m)" value={config.cellM} onCommit={(v) => change((c) => ({ ...c, cellM: v }))} />
        <FormSelect label="Vegetación base" value={config.vegetationDefault} options={VEGETATION_OPTIONS} onChange={(v) => change((c) => ({ ...c, vegetationDefault: v as VegetationType }))} />
      </div>
      <SelectionForm editor={editor} />
      <div className="mt-auto flex flex-col gap-3">
        <p className={`font-mono text-[11px] ${cells > MAX_CELLS ? "text-ra-red" : "text-ra-mut"}`}>Máximo 40 000 celdas. Actual: {cells}.</p>
        {saver.failure ? <p role="alert" className="text-xs text-ra-red">{saver.failure}</p> : null}
        <AppButton fullWidth isPending={saver.saving === "save"} isDisabled={Boolean(saver.saving)} onPress={() => saver.save("save")}>
          <Save className="size-4" /> Guardar escenario
        </AppButton>
        <AppButton tone="ghost" fullWidth isPending={saver.saving === "use"} isDisabled={Boolean(saver.saving)} onPress={() => saver.save("use")}>
          <Play className="size-4" /> Usar en misión
        </AppButton>
      </div>
    </aside>
  );
}
