import { array, number, object, string } from "yup";

const numeric = (min: number, max: number) =>
  number()
    .transform((value, original) => (String(original).trim() === "" ? undefined : value))
    .typeError("Número no válido")
    .required("Obligatorio")
    .min(min, `Mínimo ${min}`)
    .max(max, `Máximo ${max}`);

export const missionSchema = object({
  personId: string().required("Elige una persona"),
  droneIds: array(string().required()).required().min(1, "Elige al menos un dron"),
  cameraIds: array(string().required()).required().min(1, "Elige al menos una cámara"),
  drones: numeric(1, 10).integer("Debe ser entero"),
  points: numeric(1, 30).integer("Debe ser entero"),
  population: numeric(4, 500).integer("Debe ser entero"),
  generations: numeric(1, 2000).integer("Debe ser entero"),
  crossover: numeric(0, 1),
  eta: numeric(1, 100),
  sigma: numeric(0, 1),
  reserve: numeric(0, 90),
  separation: numeric(0, 1000),
  seed: numeric(0, 999999999).integer("Debe ser entero"),
  randomFactor: numeric(0, 10),
});
