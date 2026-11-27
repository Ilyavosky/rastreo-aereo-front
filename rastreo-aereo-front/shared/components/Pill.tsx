import type { ReactNode } from "react";

type Props = { children: ReactNode; active: boolean; onClick: () => void };

export function Pill({ children, active, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`cursor-pointer whitespace-nowrap rounded-full border px-3.5 py-[7px] text-xs font-semibold ${
        active ? "border-ra-acc bg-ra-panel2 text-ra-acc" : "border-ra-line text-ra-mut hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
