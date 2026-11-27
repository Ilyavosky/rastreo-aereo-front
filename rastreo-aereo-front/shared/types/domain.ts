export type Point = { x: number; y: number };
export type Rect = { x0: number; y0: number; x1: number; y1: number };
export type VegetationType = "open" | "brush" | "dense";
export type VegetationZone = Rect & { type: VegetationType };
export type Hill = Point & { heightM: number; sigmaM: number };
export type PathKind = "trail" | "river";
export type MapPath = { kind: PathKind; points: Point[] };

export type ScenarioConfig = {
  widthM: number;
  heightM: number;
  cellM: number;
  base?: Point;
  lastSeen?: Point;
  vegetationDefault: VegetationType;
  vegetationZones: VegetationZone[];
  forbiddenZones: Rect[];
  hills: Hill[];
  paths: MapPath[];
};

export type Scenario = {
  id: string;
  name: string;
  isTemplate: boolean;
  config: ScenarioConfig;
};

export type Drone = {
  id: string;
  name: string;
  batteryWh: number;
  vMin: number;
  vMax: number;
  hMin: number;
  hMax: number;
  vVertical?: number;
  pBaseW?: number;
  cDrag?: number;
  cAltitude?: number;
  active: boolean;
};

export type Camera = {
  id: string;
  name: string;
  modality: "optical" | "thermal";
  fovDeg: number;
  widthPx: number;
  powerW?: number;
  batteryWh?: number;
  maxRangeM?: number;
  active: boolean;
};

export type Person = {
  id: string;
  name: string;
  posture: "standing" | "sitting" | "lying";
  criticalDimM: number;
  pxMinOptical: number;
  pxMinThermal: number;
};
