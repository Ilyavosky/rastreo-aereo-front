import { notFound } from "next/navigation";
import { CATALOG_KINDS, CatalogView, type CatalogKind } from "@/features/catalogs";

export function generateStaticParams() {
  return CATALOG_KINDS.map((tipo) => ({ tipo }));
}

export default async function Page({ params }: PageProps<"/catalogos/[tipo]">) {
  const { tipo } = await params;
  if (!CATALOG_KINDS.includes(tipo as CatalogKind)) notFound();
  return <CatalogView key={tipo} kind={tipo as CatalogKind} />;
}
