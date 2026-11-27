import { number, object, ref, string, type AnySchema } from "yup";
import { CATALOGS, type CatalogKind, type FieldDef } from "../config/catalogs";

const toNumber = () =>
  number()
    .transform((value, original) => (String(original).trim() === "" ? undefined : value))
    .typeError("Escribe un número");

function fieldSchema(field: FieldDef, isEdit: boolean): AnySchema {
  if (field.options) return string().required("Elige una opción");
  if (!field.numeric) return string().trim().required("Campo obligatorio").max(80, "Máximo 80 caracteres");
  const base = toNumber().min(0, "No puede ser negativo");
  return isEdit && field.optionalOnEdit ? base : base.required("Campo obligatorio");
}

export function catalogSchema(kind: CatalogKind, isEdit: boolean) {
  const shape: Record<string, AnySchema> = Object.fromEntries(
    CATALOGS[kind].fields.map((field) => [field.key, fieldSchema(field, isEdit)]),
  );
  if (kind === "drones") {
    shape.vMax = toNumber().required("Campo obligatorio").moreThan(ref("vMin"), "Debe ser mayor que la mínima");
    shape.hMax = toNumber().required("Campo obligatorio").moreThan(ref("hMin"), "Debe ser mayor que la mínima");
  }
  if (kind === "camaras") {
    shape.fovDeg = toNumber().required("Campo obligatorio").moreThan(0, "Mayor que 0").lessThan(180, "Menor que 180");
  }
  if (kind === "personas") {
    shape.pxMinOptical = toNumber().required("Campo obligatorio").min(1, "Mínimo 1");
    shape.pxMinThermal = toNumber().required("Campo obligatorio").min(1, "Mínimo 1");
  }
  return object(shape);
}
