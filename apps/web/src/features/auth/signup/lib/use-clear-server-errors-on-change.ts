import { useEffect, useRef } from 'react';
import {
  type Control,
  type FieldError,
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormClearErrors,
  useWatch,
} from 'react-hook-form';

const CLEAR_ON_CHANGE_ERROR_TYPES = new Set([
  'server',
  'server-validation',
  'duplicate',
  'dup-check-required',
]);

type UseClearServerErrorsOnChangeArgs<T extends FieldValues> = {
  control: Control<T>;
  errors: FieldErrors<T>;
  clearErrors: UseFormClearErrors<T>;
  fields: readonly Path<T>[];
};

export function useClearServerErrorsOnChange<T extends FieldValues>({
  control,
  errors,
  clearErrors,
  fields,
}: UseClearServerErrorsOnChangeArgs<T>) {
  const values = useWatch({ control, name: fields }) as unknown[];
  const errorValuesRef = useRef<Map<Path<T>, unknown>>(new Map());

  useEffect(() => {
    fields.forEach((field, index) => {
      const fieldError = errors[field as keyof FieldErrors<T>] as FieldError | undefined;
      if (!fieldError?.type || !CLEAR_ON_CHANGE_ERROR_TYPES.has(fieldError.type)) {
        errorValuesRef.current.delete(field);
        return;
      }

      if (!errorValuesRef.current.has(field)) {
        errorValuesRef.current.set(field, values?.[index]);
      }
    });
  }, [errors, fields, values]);

  useEffect(() => {
    fields.forEach((field, index) => {
      if (!errorValuesRef.current.has(field)) return;

      const trackedValue = errorValuesRef.current.get(field);
      if (Object.is(values?.[index], trackedValue)) return;

      clearErrors(field);
      errorValuesRef.current.delete(field);
    });
  }, [clearErrors, fields, values]);
}
