"use client";

import { Navigation2 } from "lucide-react";
import { useAnimationFrame } from "motion/react";
import { useRef } from "react";

type Props = { path: string; color: string; size: number; seconds: number };

export function DroneFlight({ path, color, size, seconds }: Props) {
  const track = useRef<SVGPathElement>(null);
  const drone = useRef<SVGGElement>(null);
  const startedAt = useRef<number>(null);

  useAnimationFrame((time) => {
    const line = track.current;
    if (!line) return;
    startedAt.current ??= time;
    const length = line.getTotalLength();
    const at = ((((time - startedAt.current) / 1000) % seconds) / seconds) * length;
    const point = line.getPointAtLength(at);
    const ahead = line.getPointAtLength(Math.min(length, at + 1));
    const angle = (Math.atan2(ahead.y - point.y, ahead.x - point.x) * 180) / Math.PI;
    drone.current?.setAttribute("transform", `translate(${point.x} ${point.y}) rotate(${angle})`);
  });

  return (
    <>
      <path ref={track} d={path} stroke="none" />
      <g ref={drone}>
        <g transform="rotate(90)">
          <Navigation2 x={-size / 2} y={-size / 2} width={size} height={size} fill={color} stroke="#fff" />
        </g>
      </g>
    </>
  );
}
