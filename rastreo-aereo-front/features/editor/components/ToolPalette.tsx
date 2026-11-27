import { CircleDot, CircleSlash, Footprints, MapPin, Mountain, MousePointer2, Trees, Waves, type LucideIcon } from "lucide-react";
import type { Tool } from "../services/editor.rules";

const TOOLS: { id: Tool; name: string; hint: string; icon: LucideIcon }[] = [
  { id: "select", name: "Seleccionar", hint: "Mover un elemento", icon: MousePointer2 },
  { id: "base", name: "Base", hint: "Un clic: punto de despegue", icon: MapPin },
  { id: "lastSeen", name: "Último avistamiento", hint: "Un clic (opcional)", icon: CircleDot },
  { id: "vegetation", name: "Vegetación", hint: "Arrastra un rectángulo", icon: Trees },
  { id: "forbidden", name: "Zona prohibida", hint: "Arrastra un rectángulo", icon: CircleSlash },
  { id: "hill", name: "Colina", hint: "Un clic en el centro", icon: Mountain },
  { id: "trail", name: "Sendero", hint: "Línea por puntos", icon: Footprints },
  { id: "river", name: "Río", hint: "Línea por puntos", icon: Waves },
];

export function ToolPalette({ active, onChoose }: { active: Tool; onChoose: (tool: Tool) => void }) {
  return (
    <aside className="flex shrink-0 flex-col gap-2 overflow-y-auto bg-ra-panel p-4 lg:w-60">
      <h2 className="text-sm font-semibold">Dibujar en el mapa</h2>
      {TOOLS.map(({ id, name, hint, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChoose(id)}
          aria-pressed={active === id}
          className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left ${
            active === id ? "border-ra-acc bg-ra-panel2 text-ra-acc" : "border-ra-line"
          }`}
        >
          <Icon className="size-4 shrink-0" />
          <span className="flex flex-col">
            <span className="text-[13px] font-medium">{name}</span>
            <span className="text-[10px] text-ra-mut">{hint}</span>
          </span>
        </button>
      ))}
    </aside>
  );
}
