"use client";

import { Button, Spinner } from "@heroui/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onPress?: () => void;
  tone?: "primary" | "ghost" | "danger";
  isPending?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit";
};

const TONES = {
  primary: { variant: "primary", className: "" },
  ghost: { variant: "outline", className: "border-ra-line text-foreground" },
  danger: { variant: "outline", className: "border-ra-line text-ra-red" },
} as const;

export function AppButton({ children, tone = "primary", isPending, ...props }: Props) {
  const { variant, className } = TONES[tone];
  return (
    <Button
      {...props}
      variant={variant}
      isPending={isPending}
      className={`h-10 gap-2 rounded-lg px-4 text-[13px] font-semibold ${className}`}
    >
      {isPending ? <Spinner size="sm" color="current" /> : null}
      {children}
    </Button>
  );
}
