"use client";

import { useSyncExternalStore } from "react";

export type MapMode = "2d" | "3d";

const KEY = "ra.mapView";
const listeners = new Set<() => void>();
let current: MapMode | undefined;

function read(): MapMode {
  if (current) return current;
  try {
    current = window.localStorage.getItem(KEY) === "2d" ? "2d" : "3d";
  } catch {
    current = "3d";
  }
  return current;
}

function write(next: MapMode) {
  current = next;
  try {
    window.localStorage.setItem(KEY, next);
  } catch {}
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useMapView() {
  const mode = useSyncExternalStore(subscribe, read, (): MapMode => "3d");
  return { mode, isRelief: mode === "3d", setMode: write };
}
