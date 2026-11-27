"use client";

import { Label, ListBox, Select } from "@heroui/react";

export type Option = { id: string; label: string };

type Props = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  error?: string;
};

export function FormSelect({ label, value, options, onChange, error }: Props) {
  return (
    <Select
      value={value || null}
      onChange={(key) => onChange(String(key ?? ""))}
      isInvalid={Boolean(error)}
      placeholder="Elige una opción"
      className="flex min-w-0 flex-1 flex-col gap-[5px] [.flex-col>&]:flex-none"
    >
      <Label className="text-[11px] font-medium text-ra-mut">{label}</Label>
      <Select.Trigger className={`rounded-md border bg-background px-2.5 py-2 font-mono text-[13px] ${error ? "border-ra-red" : "border-ra-line"}`}>
        <Select.Value className="truncate text-[13px]" />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {options.map((option) => (
            <ListBox.Item key={option.id} id={option.id} textValue={option.label}>
              {option.label}
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
      {error ? <p className="text-[11px] text-ra-red">{error}</p> : null}
    </Select>
  );
}
