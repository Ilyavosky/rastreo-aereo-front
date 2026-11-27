import type { Point, ScenarioConfig } from "@/shared/types/domain";
import type { ReactNode, SVGProps } from "react";
import { MapRoutes } from "./MapRoutes";
import { MapTerrain } from "./MapTerrain";

type Props = Omit<SVGProps<SVGSVGElement>, "children"> & {
  config: ScenarioConfig;
  routes?: Point[][];
  swath?: boolean;
  faint?: boolean;
  waypoints?: boolean;
  flying?: boolean;
  flightSeconds?: number[];
  parked?: Point[];
  priority?: boolean;
  label?: string;
  children?: ReactNode;
};

export function MapView({ config, routes, swath, faint, waypoints, flying, flightSeconds, parked, priority, label, children, className = "", ...svg }: Props) {
  const { widthM: w, heightM: h, base, lastSeen } = config;
  const u = Math.max(w, h) / 1000;

  return (
    <svg {...svg} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label ?? "Mapa del escenario"} className={`rounded-lg ${className}`}>
      <MapTerrain config={config} priority={priority} />
      {parked && base ? <rect x={base.x - 16 * u} y={h - base.y - 16 * u} width={32 * u} height={32 * u} fill="#fff" fillOpacity={0.35} /> : null}
      {routes && base ? <MapRoutes routes={routes} base={base} height={h} unit={u} swath={swath} faint={faint} waypoints={waypoints} flying={flying} flightSeconds={flightSeconds} parked={parked} /> : null}
      {base && !parked ? <rect x={base.x - 16 * u} y={h - base.y - 16 * u} width={32 * u} height={32 * u} fill="#fff" /> : null}
      {lastSeen ? (
        <g stroke="#f2c14e" strokeWidth={3 * u}>
          <circle cx={lastSeen.x} cy={h - lastSeen.y} r={14 * u} fill="#f2c14e" />
          <circle cx={lastSeen.x} cy={h - lastSeen.y} r={28 * u} fill="none" />
          <circle cx={lastSeen.x} cy={h - lastSeen.y} r={28 * u} fill="none" className="ra-ping" />
        </g>
      ) : null}
      {children}
    </svg>
  );
}
