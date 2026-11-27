import { ValidationError, type AnyObjectSchema, type InferType } from "yup";

export type FieldErrors = Record<string, string>;

export async function validateWithYup<S extends AnyObjectSchema>(schema: S, input: unknown) {
  try {
    const values = (await schema.validate(input, { abortEarly: false })) as InferType<S>;
    return { ok: true as const, values, errors: {} as FieldErrors };
  } catch (error) {
    if (!(error instanceof ValidationError)) throw error;
    const errors: FieldErrors = {};
    for (const item of error.inner) {
      if (item.path && !errors[item.path]) errors[item.path] = item.message;
    }
    return { ok: false as const, values: undefined, errors };
  }
}
