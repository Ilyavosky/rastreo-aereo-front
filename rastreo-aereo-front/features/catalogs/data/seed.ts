import type { Camera, Drone, Person } from "@/shared/types/domain";

export const DRONES: Drone[] = [
  { id: "d1", name: "Ligero", batteryWh: 60, vMin: 3, vMax: 10, hMin: 15, hMax: 60, active: true },
  { id: "d2", name: "Estándar", batteryWh: 100, vMin: 3, vMax: 12, hMin: 15, hMax: 80, active: true },
  { id: "d3", name: "Largo alcance", batteryWh: 150, vMin: 4, vMax: 14, hMin: 20, hMax: 100, active: true },
];

export const CAMERAS: Camera[] = [
  { id: "c1", name: "Óptica 4K", modality: "optical", fovDeg: 84, widthPx: 4000, active: true },
  { id: "c2", name: "Óptica 2K", modality: "optical", fovDeg: 90, widthPx: 2000, active: true },
  { id: "c3", name: "Térmica 640", modality: "thermal", fovDeg: 45, widthPx: 640, active: true },
];

export const PERSONS: Person[] = [
  { id: "p1", name: "Adulto de pie", posture: "standing", criticalDimM: 0.5, pxMinOptical: 20, pxMinThermal: 8 },
  { id: "p2", name: "Adulto tendido", posture: "lying", criticalDimM: 0.45, pxMinOptical: 24, pxMinThermal: 10 },
  { id: "p3", name: "Niño", posture: "standing", criticalDimM: 0.3, pxMinOptical: 20, pxMinThermal: 8 },
];
