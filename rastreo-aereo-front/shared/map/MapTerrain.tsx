import type { ScenarioConfig, VegetationType } from "@/shared/types/domain";
import { smoothPath } from "./geometry";

const VEGETATION: Record<VegetationType, string> = { open: "#0f1c1b", brush: "#17302a", dense: "#1c3b30" };

export function MapTerrain({ config, priority }: { config: ScenarioConfig; priority?: boolean }) {
  const { widthM: w, heightM: h } = config;
  const u = Math.max(w, h) / 1000;
  const lines = Array.from({ length: 19 }, (_, i) => (i + 1) / 20);

  return (
    <g>
      <rect width={w} height={h} fill={VEGETATION[config.vegetationDefault]} />
      {config.vegetationZones.map((zone, i) => (
        <rect key={i} className="ra-appear" x={zone.x0} y={h - zone.y1} width={zone.x1 - zone.x0} height={zone.y1 - zone.y0} rx={60 * u} fill={VEGETATION[zone.type]} />
      ))}
      <g stroke="#fff" strokeOpacity={0.05} strokeWidth={u}>
        {lines.map((t) => (
          <path key={t} d={`M${t * w} 0V${h}M0 ${t * h}H${w}`} />
        ))}
      </g>
      {config.hills.map((hill, i) =>
        [1, 2, 3, 4, 5].map((k) => (
          <ellipse key={`${i}-${k}`} cx={hill.x} cy={h - hill.y} rx={(hill.sigmaM * 2 * k) / 5} ry={(hill.sigmaM * 1.6 * k) / 5} fill="none" stroke="#7fa89a" strokeOpacity={0.3} strokeWidth={2 * u} />
        )),
      )}
      {priority && config.lastSeen
        ? [6, 5, 4, 3, 2, 1].map((k) => (
            <circle key={k} cx={config.lastSeen!.x} cy={h - config.lastSeen!.y} r={k * 45 * u} fill="#f2c14e" fillOpacity={0.045} />
          ))
        : null}
      {config.paths.map((path, i) => (
        <path key={i} className="ra-appear" d={smoothPath(path.points, h)} fill="none" strokeLinecap="round" stroke={path.kind === "river" ? "#3e7fb8" : "#d9c49a"} strokeWidth={(path.kind === "river" ? 14 : 5) * u} strokeDasharray={path.kind === "trail" ? `${12 * u} ${10 * u}` : undefined} />
      ))}
      {config.forbiddenZones.map((zone, i) => (
        <rect key={i} className="ra-appear" x={zone.x0} y={h - zone.y1} width={zone.x1 - zone.x0} height={zone.y1 - zone.y0} fill="#ff5d6c" fillOpacity={0.18} stroke="#ff5d6c" strokeWidth={3 * u} strokeDasharray={`${10 * u} ${7 * u}`} />
      ))}
    </g>
  );
}
