"use client";

import { Inbox, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { AppButton } from "./AppButton";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center">
      <TriangleAlert className="size-8 text-ra-red" />
      <p className="text-sm">{message}</p>
      {onRetry ? <AppButton tone="ghost" onPress={onRetry}>Reintentar</AppButton> : null}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[10px] border border-ra-line p-8 text-center">
      <Inbox className="size-7 text-ra-mut" />
      <p className="text-sm font-semibold">{title}</p>
      <div className="text-xs text-ra-mut">{children}</div>
    </div>
  );
}
