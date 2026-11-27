"use client";

import { useRouter } from "next/navigation";
import { useTransition, type ReactNode } from "react";
import { AppButton } from "./AppButton";

type Props = {
  href: string;
  children: ReactNode;
  tone?: "primary" | "ghost";
  fullWidth?: boolean;
  before?: () => void;
};

export function NavButton({ href, before, children, ...props }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <AppButton
      {...props}
      isPending={isPending}
      onPress={() => {
        before?.();
        startTransition(() => router.push(href));
      }}
    >
      {children}
    </AppButton>
  );
}
