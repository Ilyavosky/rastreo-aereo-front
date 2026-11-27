"use client";

import { useCallback } from "react";
import { getScenario } from "@/features/scenarios/services/scenario.service";
import { ErrorState } from "@/shared/components/Feedback";
import { useResource } from "@/shared/lib/useResource";
import type { Scenario } from "@/shared/types/domain";
import { useEditor } from "../hooks/useEditor";
import { useSaveScenario } from "../hooks/useSaveScenario";
import { EditorCanvas } from "./EditorCanvas";
import { EditorSkeleton } from "./EditorSkeleton";
import { PropertiesPanel } from "./PropertiesPanel";
import { ToolPalette } from "./ToolPalette";

function EditorWorkspace({ scenario }: { scenario?: Scenario }) {
  const editor = useEditor(scenario);
  const saver = useSaveScenario(scenario, editor.config);
  return (
    <div className="flex flex-1 flex-col lg:h-[calc(100dvh-60px)] lg:flex-row">
      <ToolPalette active={editor.tool} onChoose={editor.chooseTool} />
      <EditorCanvas editor={editor} />
      <PropertiesPanel editor={editor} saver={saver} />
    </div>
  );
}

export function EditorView({ id }: { id: string }) {
  const isNew = id === "nuevo";
  const load = useCallback(async () => ({ scenario: isNew ? undefined : await getScenario(id) }), [id, isNew]);
  const { data, error, isLoading, reload } = useResource(load);

  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (isLoading || !data) return <EditorSkeleton />;
  return <EditorWorkspace key={id} scenario={data.scenario} />;
}
