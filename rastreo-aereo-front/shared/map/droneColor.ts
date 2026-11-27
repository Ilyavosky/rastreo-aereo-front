export const DRONE_COLORS = ["#ff7a45", "#3ccfb4", "#5aa9ff", "#f2c14e", "#c58cff"];

export const droneColor = (index: number) =>
  DRONE_COLORS[index] ?? `hsl(${Math.round((index * 137.5) % 360)}, 75%, 66%)`;
