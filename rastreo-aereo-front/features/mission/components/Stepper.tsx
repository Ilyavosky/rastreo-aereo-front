"use client";

import { Minus, Plus } from "lucide-react";

type Props = { label: string; value: number; onChange: (value: number) => void };

const BUTTON = "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-ra-line hover:bg-ra-panel2 disabled:cursor-default disabled:opacity-35";
const MAX_TYPED = 999;

export function Stepper({ label, value, onChange }: Props) {
  const set = (next: number) => onChange(Math.min(MAX_TYPED, Math.max(0, next)));

  return (
    <div className="flex items-center gap-1">
      <button type="button" aria-label={`Quitar uno: ${label}`} disabled={value === 0} onClick={() => set(value - 1)} className={BUTTON}>
        <Minus className="size-3.5" />
      </button>
      <input
        aria-label={`Cantidad: ${label}`}
        inputMode="numeric"
        value={value}
        onFocus={(e) => e.target.select()}
        onChange={(e) => set(Number(e.target.value.replace(/\D/g, "")))}
        className="h-7 w-10 rounded-md border border-ra-line bg-background text-center font-mono text-[13px]"
      />
      <button type="button" aria-label={`Agregar uno: ${label}`} disabled={value >= MAX_TYPED} onClick={() => set(value + 1)} className={BUTTON}>
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
