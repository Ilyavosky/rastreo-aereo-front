"use client";

import { animate, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function AnimatedNumber({ value, digits = 1 }: { value: number; digits?: number }) {
  const [shown, setShown] = useState(value);
  const current = useRef(value);
  const reduce = useReducedMotion();

  useEffect(() => {
    const controls = animate(current.current, value, {
      duration: reduce ? 0 : 0.6,
      ease: "easeOut",
      onUpdate: (next) => {
        current.current = next;
        setShown(next);
      },
    });
    return () => controls.stop();
  }, [value, reduce]);

  return <>{shown.toFixed(digits)}</>;
}
