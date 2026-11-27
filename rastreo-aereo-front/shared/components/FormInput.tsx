"use client";

import { FieldError, Input, Label, TextField } from "@heroui/react";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
};

export function FormInput({ label, value, onChange, error, placeholder, required }: Props) {
  return (
    <TextField value={value} onChange={onChange} isInvalid={Boolean(error)} className="flex min-w-0 flex-1 flex-col gap-[5px] [.flex-col>&]:flex-none">
      <Label className="text-[11px] font-medium text-ra-mut">
        {label}
        {required ? <span className="text-ra-red"> *</span> : null}
      </Label>
      <Input
        placeholder={placeholder}
        className={`w-full min-w-0 rounded-md border bg-background px-2.5 py-2 font-mono text-[13px] ${
          error ? "border-ra-red" : "border-ra-line"
        }`}
      />
      <FieldError className="text-[11px] text-ra-red">{error}</FieldError>
    </TextField>
  );
}
