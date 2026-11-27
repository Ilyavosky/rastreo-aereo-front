import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[10px] border border-ra-line bg-ra-panel ${className}`}>{children}</section>;
}
