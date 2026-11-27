"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

const ITEMS = [
  { href: "/mision", label: "Misión" },
  { href: "/corridas", label: "Corridas" },
  { href: "/escenarios", label: "Escenarios" },
  { href: "/catalogos/drones", label: "Catálogos" },
];

function NavLinks({ pathname }: { pathname: string }) {
  const reduce = useReducedMotion();

  return (
    <nav className="flex items-center gap-4 md:gap-7">
      {ITEMS.map((item) => {
        const active = pathname.startsWith(`/${item.href.split("/")[1]}`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`relative isolate rounded-md px-3 py-[7px] text-[13px] font-medium transition-colors ${
              active ? "text-foreground" : "text-ra-mut hover:text-foreground"
            }`}
          >
            {active ? (
              <motion.span layoutId="ra-nav" transition={{ duration: reduce ? 0 : 0.25 }} className="absolute inset-0 -z-10 rounded-md bg-ra-panel2" />
            ) : null}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function ActiveLinks() {
  return <NavLinks pathname={usePathname()} />;
}

export function TopBar() {
  return (
    <header className="flex h-[60px] shrink-0 items-center gap-7 overflow-x-auto bg-ra-panel px-6">
      <div className="flex items-center gap-2.5">
        <span className="size-3 rounded-full bg-ra-acc" />
        <span className="text-[17px] font-semibold">RastroAéreo</span>
      </div>
      <Suspense fallback={<NavLinks pathname="" />}>
        <ActiveLinks />
      </Suspense>
    </header>
  );
}
