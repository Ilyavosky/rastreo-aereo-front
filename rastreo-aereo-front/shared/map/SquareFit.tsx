import type { ReactNode } from "react";

export function SquareFit({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-[320px] w-full flex-1">
      <div className="absolute inset-0 flex items-center justify-center [&>svg]:size-full">{children}</div>
    </div>
  );
}
