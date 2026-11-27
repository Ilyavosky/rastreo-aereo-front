"use client";

import { useState } from "react";
import { rectFrom } from "@/shared/map/geometry";
import type { Point, Scenario, ScenarioConfig } from "@/shared/types/domain";
import { emptyConfig } from "@/features/scenarios/data/templates";
import { clampPoint, hitTest, type Selection, type Tool } from "../services/editor.rules";
import { moveElement, removeElement } from "../services/editor.transitions";
import { useHistory } from "./useHistory";

type Drag = { from: Point; to: Point };

export function useEditor(scenario?: Scenario) {
  const history = useHistory<ScenarioConfig>(scenario?.config ?? emptyConfig());
  const [tool, setTool] = useState<Tool>(scenario ? "select" : "base");
  const [selection, setSelection] = useState<Selection>();
  const [drag, setDrag] = useState<Drag>();
  const [draft, setDraft] = useState<Point[]>([]);
  const config = history.value;

  const chooseTool = (next: Tool) => {
    setTool(next);
    setDraft([]);
    setDrag(undefined);
  };

  const down = (raw: Point) => {
    const point = clampPoint(raw, config);
    if (tool === "base" || tool === "lastSeen") {
      history.commit((c) => ({ ...c, [tool]: point }));
      setSelection(tool === "base" ? { kind: "base" } : { kind: "lastSeen" });
    } else if (tool === "hill") {
      history.commit((c) => ({ ...c, hills: [...c.hills, { ...point, heightM: 80, sigmaM: 120 }] }));
      setSelection({ kind: "hill", index: config.hills.length });
    } else if (tool === "trail" || tool === "river") {
      setDraft((d) => [...d, point]);
    } else {
      if (tool === "select") setSelection(hitTest(config, point));
      setDrag({ from: point, to: point });
    }
  };

  const move = (raw: Point) => drag && setDrag({ ...drag, to: clampPoint(raw, config) });

  const up = () => {
    if (!drag) return;
    const dx = drag.to.x - drag.from.x;
    const dy = drag.to.y - drag.from.y;
    setDrag(undefined);
    if (tool === "select") {
      if (selection && (dx || dy)) history.commit((c) => moveElement(c, selection, dx, dy));
      return;
    }
    if (Math.abs(dx) < 10 || Math.abs(dy) < 10) return;
    const rect = rectFrom(drag.from, drag.to);
    if (tool === "vegetation") {
      history.commit((c) => ({ ...c, vegetationZones: [...c.vegetationZones, { ...rect, type: "dense" }] }));
      setSelection({ kind: "vegetation", index: config.vegetationZones.length });
    } else if (tool === "forbidden") {
      history.commit((c) => ({ ...c, forbiddenZones: [...c.forbiddenZones, rect] }));
      setSelection({ kind: "forbidden", index: config.forbiddenZones.length });
    }
  };

  const finishPath = () => {
    if (draft.length < 2 || (tool !== "trail" && tool !== "river")) return;
    history.commit((c) => ({ ...c, paths: [...c.paths, { kind: tool, points: draft }] }));
    setSelection({ kind: "path", index: config.paths.length });
    setDraft([]);
  };

  const remove = () => {
    if (!selection) return;
    history.commit((c) => removeElement(c, selection));
    setSelection(undefined);
  };

  const preview = tool === "select" && drag && selection ? moveElement(config, selection, drag.to.x - drag.from.x, drag.to.y - drag.from.y) : config;
  const step = () => (setSelection(undefined), setDraft([]));

  return {
    config,
    preview,
    tool,
    chooseTool,
    selection,
    drag: tool === "vegetation" || tool === "forbidden" ? drag : undefined,
    draft,
    down,
    move,
    up,
    finishPath,
    remove,
    change: history.commit,
    undo: () => (step(), history.undo()),
    redo: () => (step(), history.redo()),
    canUndo: history.canUndo,
    canRedo: history.canRedo,
  };
}

export type EditorModel = ReturnType<typeof useEditor>;
