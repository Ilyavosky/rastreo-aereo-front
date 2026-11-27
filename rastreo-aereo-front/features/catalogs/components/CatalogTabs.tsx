import Link from "next/link";
import { CATALOGS, CATALOG_KINDS, type CatalogKind } from "../config/catalogs";

export function CatalogTabs({ active }: { active: CatalogKind }) {
  return (
    <nav className="flex gap-2">
      {CATALOG_KINDS.map((kind) => (
        <Link
          key={kind}
          href={`/catalogos/${kind}`}
          className={`rounded-full border px-4 py-2 text-[13px] font-semibold ${
            kind === active ? "border-ra-acc bg-ra-panel2 text-ra-acc" : "border-ra-line text-ra-mut hover:text-foreground"
          }`}
        >
          {CATALOGS[kind].tab}
        </Link>
      ))}
    </nav>
  );
}
