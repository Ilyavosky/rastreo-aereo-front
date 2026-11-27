import { rectFrom } from "@/shared/map/geometry";
import type { Rect } from "@/shared/types/domain";
import type { EditorModel } from "../hooks/useEditor";

export function EditorOverlay({ editor }: { editor: EditorModel }) {
  const { preview: c, selection, drag, draft } = editor;
  const h = c.heightM;
  const u = Math.max(c.widthM, h) / 1000;
  const box = (r: Rect) => ({ x: r.x0, y: h - r.y1, width: r.x1 - r.x0, height: r.y1 - r.y0 });
  const around = (x: number, y: number, r: number): Rect => ({ x0: x - r, y0: y - r, x1: x + r, y1: y + r });

  let selected: Rect | undefined;
  if (selection?.kind === "forbidden") selected = c.forbiddenZones[selection.index];
  if (selection?.kind === "vegetation") selected = c.vegetationZones[selection.index];
  if (selection?.kind === "base" && c.base) selected = around(c.base.x, c.base.y, 30 * u);
  if (selection?.kind === "lastSeen" && c.lastSeen) selected = around(c.lastSeen.x, c.lastSeen.y, 40 * u);
  if (selection?.kind === "hill") {
    const hill = c.hills[selection.index];
    if (hill) selected = around(hill.x, hill.y, hill.sigmaM);
  }
  if (selection?.kind === "path") {
    const points = c.paths[selection.index]?.points;
    if (points) selected = { x0: Math.min(...points.map((p) => p.x)), x1: Math.max(...points.map((p) => p.x)), y0: Math.min(...points.map((p) => p.y)), y1: Math.max(...points.map((p) => p.y)) };
  }

  return (
    <g pointerEvents="none">
      {selected ? (
        <>
          <rect {...box(selected)} fill="none" stroke="#fff" strokeWidth={3 * u} strokeDasharray="16 8" className="ra-march" />
          {[[selected.x0, selected.y0], [selected.x1, selected.y0], [selected.x0, selected.y1], [selected.x1, selected.y1]].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x - 9 * u} y={h - y - 9 * u} width={18 * u} height={18 * u} fill="#fff" />
          ))}
        </>
      ) : null}
      {drag ? <rect {...box(rectFrom(drag.from, drag.to))} fill="#ff7a45" fillOpacity={0.15} stroke="#ff7a45" strokeWidth={3 * u} strokeDasharray="16 8" className="ra-march" /> : null}
      {draft.length ? (
        <g stroke="#ff7a45" strokeWidth={4 * u}>
          <polyline points={draft.map((p) => `${p.x},${h - p.y}`).join(" ")} fill="none" strokeDasharray="16 8" className="ra-march" />
          {draft.map((p, i) => <circle key={i} cx={p.x} cy={h - p.y} r={8 * u} fill="#0f1c1b" />)}
        </g>
      ) : null}
    </g>
  );
}
