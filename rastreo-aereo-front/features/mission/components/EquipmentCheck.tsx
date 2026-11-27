"use client";

import { Checkbox } from "@heroui/react";
import { Check } from "lucide-react";

type Props = { name: string; detail: string; checked: boolean; onToggle: () => void };

export function EquipmentCheck({ name, detail, checked, onToggle }: Props) {
  return (
    <Checkbox isSelected={checked} onChange={onToggle} className="w-full">
      <Checkbox.Content className={`flex w-full cursor-pointer items-center gap-2.5 rounded-md border border-ra-line px-2.5 py-2 ${checked ? "bg-ra-panel2" : ""}`}>
        <span aria-hidden="true" className={`flex size-4 shrink-0 items-center justify-center rounded border ${checked ? "border-ra-teal bg-ra-teal text-background" : "border-ra-mut"}`}>
          {checked ? <Check className="size-3" strokeWidth={3} /> : null}
        </span>
        <span className="flex flex-col">
          <span className="text-[13px] font-medium">{name}</span>
          <span className="font-mono text-[11px] text-ra-mut">{detail}</span>
        </span>
      </Checkbox.Content>
    </Checkbox>
  );
}
