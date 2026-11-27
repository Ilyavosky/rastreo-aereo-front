import { object, string } from "yup";

export const scenarioSchema = object({
  name: string().trim().required("Escribe un nombre").max(80, "Máximo 80 caracteres"),
});
