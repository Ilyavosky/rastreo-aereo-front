"use client";

import { useState, type FormEvent } from "react";
import { validateWithYup, type FieldErrors } from "@/shared/lib/validation";
import { CATALOGS, type CatalogItem, type CatalogKind } from "../config/catalogs";
import { catalogSchema } from "../schemas/catalog.schema";
import { saveCatalogItem } from "../services/catalog.service";

export function useCatalogForm(kind: CatalogKind, item: CatalogItem | undefined, onSaved: () => void) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(CATALOGS[kind].fields.map((f) => [f.key, item?.[f.key] === undefined ? "" : String(item[f.key])])),
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [failure, setFailure] = useState("");
  const [isSaving, setSaving] = useState(false);

  const setValue = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setFailure("");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await validateWithYup(catalogSchema(kind, Boolean(item)), values);
    if (!result.ok) return setErrors(result.errors);
    setSaving(true);
    try {
      await saveCatalogItem(kind, result.values as Record<string, unknown>, item?.id);
      onSaved();
    } catch (error) {
      setFailure(error instanceof Error ? error.message : "No se pudo guardar");
      setSaving(false);
    }
  };

  return { values, errors, failure, isSaving, setValue, submit };
}
