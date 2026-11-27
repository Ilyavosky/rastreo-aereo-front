export const genesPerIndividual = (drones: number, points: number) => drones * points * 4 + 2 * drones;

export const DEFAULT_PARAMS = {
  drones: "3",
  points: "8",
  population: "60",
  generations: "40",
  crossover: "0.9",
  eta: "15",
  sigma: "0.05",
  reserve: "15",
  separation: "10",
  seed: "11",
  randomFactor: "1.0",
};

export type ParamKey = keyof typeof DEFAULT_PARAMS;
