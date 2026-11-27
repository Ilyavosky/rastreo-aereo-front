"use client";

import { useState } from "react";
import { FormInput } from "@/shared/components/FormInput";

type Props = { label: string; value: number; onCommit: (value: number) => void };

export function NumberInput({ label, value, onCommit }: Props) {
  const [text, setText] = useState(String(value));
  const [last, setLast] = useState(value);
  if (value !== last) {
    setLast(value);
    setText(String(value));
  }

  return (
    <FormInput
      label={label}
      value={text}
      onChange={(next) => {
        setText(next);
        const parsed = Number(next);
        if (next.trim() !== "" && Number.isFinite(parsed) && parsed >= 0) {
          setLast(parsed);
          onCommit(parsed);
        }
      }}
    />
  );
}
