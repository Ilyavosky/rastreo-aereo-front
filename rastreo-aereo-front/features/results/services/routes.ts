import { previewRoutes } from "@/shared/map/previewRoutes";
import type { Point, ScenarioConfig } from "@/shared/types/domain";

const SAMPLE_DRONES = 3;

type Request = { sample: Point[][]; config: ScenarioConfig; drones: number; points: number; variant: number };

const startsAtBase = (sample: Point[][], { base }: ScenarioConfig) => sample[0]?.[0]?.x === base?.x && sample[0]?.[0]?.y === base?.y;

export const exampleRoutes = ({ sample, config, drones, points, variant }: Request) =>
  drones === SAMPLE_DRONES && startsAtBase(sample, config) ? sample : previewRoutes(config, drones, points, variant);
