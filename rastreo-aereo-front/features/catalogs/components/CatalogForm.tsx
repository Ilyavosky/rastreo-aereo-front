"use client";

import { Save } from "lucide-react";
import { AppButton } from "@/shared/components/AppButton";
import { FormInput } from "@/shared/components/FormInput";
import { FormSelect } from "@/shared/components/FormSelect";
import { CATALOGS, type CatalogItem, type CatalogKind } from "../config/catalogs";
import { useCatalogForm } from "../hooks/useCatalogForm";

type Props = { kind: CatalogKind; item?: CatalogItem; onCancel: () => void; onSaved: () => void };

export function CatalogForm({ kind, item, onCancel, onSaved }: Props) {
  const { values, errors, failure, isSaving, setValue, submit } = useCatalogForm(kind, item, onSaved);
  const catalog = CATALOGS[kind];

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-3 pt-3">
      <div className="grid gap-x-2.5 gap-y-3 sm:grid-cols-2">
        {catalog.fields.map((field) =>
          field.options ? (
            <FormSelect key={field.key} label={field.label} value={values[field.key]} options={field.options} error={errors[field.key]} onChange={(v) => setValue(field.key, v)} />
          ) : (
            <FormInput key={field.key} label={field.label} required={!(item && field.optionalOnEdit)} placeholder={field.placeholder} value={values[field.key]} error={errors[field.key]} onChange={(v) => setValue(field.key, v)} />
          ),
        )}
      </div>
      <p className="text-xs text-ra-mut">{catalog.rule}</p>
      {failure ? <p role="alert" className="text-xs text-ra-red">{failure}</p> : null}
      <div className="flex justify-end gap-2">
        <AppButton tone="ghost" onPress={onCancel} isDisabled={isSaving}>Cancelar</AppButton>
        <AppButton type="submit" isPending={isSaving}>
          {isSaving ? null : <Save className="size-4" />} Guardar
        </AppButton>
      </div>
    </form>
  );
}
