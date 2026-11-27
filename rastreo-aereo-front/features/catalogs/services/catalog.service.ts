import { delay } from "@/shared/lib/delay";
import { createStore, newId, type Store } from "@/shared/lib/store";
import type { CatalogItem, CatalogKind } from "../config/catalogs";
import { CAMERAS, DRONES, PERSONS } from "../data/seed";

const stores: Record<CatalogKind, Store<CatalogItem[]>> = {
  drones: createStore<CatalogItem[]>("ra.drones", DRONES as unknown as CatalogItem[]),
  camaras: createStore<CatalogItem[]>("ra.cameras", CAMERAS as unknown as CatalogItem[]),
  personas: createStore<CatalogItem[]>("ra.persons", PERSONS as unknown as CatalogItem[]),
};

export async function listCatalog(kind: CatalogKind) {
  await delay();
  return stores[kind].read();
}

export async function saveCatalogItem(kind: CatalogKind, values: Record<string, unknown>, id?: string) {
  await delay(500);
  const items = stores[kind].read();
  const name = String(values.name).toLowerCase();
  if (items.some((item) => item.id !== id && item.name.toLowerCase() === name)) {
    throw new Error("Ya existe un registro con ese nombre");
  }
  const previous = items.find((item) => item.id === id);
  const next = { active: true, ...previous, ...values, id: id ?? newId() } as CatalogItem;
  stores[kind].write(previous ? items.map((item) => (item.id === id ? next : item)) : [...items, next]);
}

export async function deleteCatalogItem(kind: CatalogKind, id: string) {
  await delay(400);
  stores[kind].write(stores[kind].read().filter((item) => item.id !== id));
}

export async function listEquipment() {
  await delay();
  return {
    drones: stores.drones.read().filter((item) => item.active),
    cameras: stores.camaras.read().filter((item) => item.active),
    persons: stores.personas.read(),
  };
}
