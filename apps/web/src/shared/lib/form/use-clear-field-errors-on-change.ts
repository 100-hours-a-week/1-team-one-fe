import { useEffect, useRef } from 'react';
import {
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormClearErrors,
  useWatch,
} from 'react-hook-form';

const UNSET = Symbol('unset');

type UseClearFieldErrorsOnChangeArgs<T extends FieldValues> = {
  control: Control<T>;
  errors: FieldErrors<T>;
  clearErrors: UseFormClearErrors<T>;
  fields: readonly Path<T>[];
};

export function useClearFieldErrorsOnChange<T extends FieldValues>({
  control,
  errors,
  clearErrors,
  fields,
}: UseClearFieldErrorsOnChangeArgs<T>) {
  const values = useWatch({ control, name: fields }) as unknown[];
  const prevValuesRef = useRef<Map<Path<T>, unknown>>(new Map());

  useEffect(() => {
    fields.forEach((field, index) => {
      const currentValue = values?.[index];
      const hasPrev = prevValuesRef.current.has(field);
      const prevValue = hasPrev ? prevValuesRef.current.get(field) : UNSET;

      if (prevValue === UNSET) {
        prevValuesRef.current.set(field, currentValue);
        return;
      }

      if (Object.is(prevValue, currentValue)) return;

      const fieldError = errors[field as keyof FieldErrors<T>];
      if (fieldError) {
        clearErrors(field);
      }

      prevValuesRef.current.set(field, currentValue);
    });
  }, [clearErrors, errors, fields, values]);
}
