import { previewRoutes } from "@/shared/map/previewRoutes";
import type { Point, ScenarioConfig } from "@/shared/types/domain";

const SAMPLE_DRONES = 3;

type Request = { sample: Point[][]; config: ScenarioConfig; drones: number; points: number; variant: number };

export const exampleRoutes = ({ sample, config, drones, points, variant }: Request) =>
  drones === SAMPLE_DRONES ? sample : previewRoutes(config, drones, points, variant);
