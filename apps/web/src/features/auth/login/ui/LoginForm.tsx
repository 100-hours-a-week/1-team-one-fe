import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/button';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { isApiError } from '@/src/shared/api';
import { HTTP_STATUS } from '@/src/shared/config/http-status';
import { useClearFieldErrorsOnChange } from '@/src/shared/lib/form/use-clear-field-errors-on-change';

import { EmailField, PasswordField } from '../../ui';
import { LOGIN_FORM_MESSAGES } from '../config/messages';
import { type LoginFormValues, loginSchema } from '../model/login-schema';

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  isPending?: boolean;
}

const LOGIN_FIELDS = ['email', 'password'] as const;

export function LoginForm({ onSubmit, isPending }: LoginFormProps) {
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);
  const previousValuesRef = useRef<{ email: string; password: string }>({
    email: '',
    password: '',
  });
  const { control, handleSubmit, formState, clearErrors } = useForm<LoginFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'firstError',
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const emailValue = useWatch({ control, name: 'email' });
  const passwordValue = useWatch({ control, name: 'password' });
  const isSubmitDisabled = isPending || formState.isSubmitting;

  useClearFieldErrorsOnChange({
    control,
    errors: formState.errors,
    clearErrors,
    fields: LOGIN_FIELDS,
  });

  useEffect(() => {
    const prevValues = previousValuesRef.current;
    const hasChanged = prevValues.email !== emailValue || prevValues.password !== passwordValue;
    previousValuesRef.current = { email: emailValue, password: passwordValue };
    if (!authErrorMessage || !hasChanged) return;
    setAuthErrorMessage(null);
  }, [authErrorMessage, emailValue, passwordValue]);

  const handleFormSubmit = async (values: LoginFormValues) => {
    if (isPending) return;

    setAuthErrorMessage(null);

    try {
      await onSubmit(values);
    } catch (error) {
      if (!isApiError(error)) return;

      if (error.status === HTTP_STATUS.UNAUTHORIZED) {
        setAuthErrorMessage(LOGIN_FORM_MESSAGES.ERROR.INVALID_CREDENTIALS);
        return;
      }

      if (error.status === HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return;
      }

      if (
        error.status === HTTP_STATUS.TOO_MANY_REQUESTS ||
        error.status >= HTTP_STATUS.SERVER_ERROR_MIN
      ) {
        setAuthErrorMessage(LOGIN_FORM_MESSAGES.ERROR.RETRY_LATER);
        return;
      }

      setAuthErrorMessage(LOGIN_FORM_MESSAGES.ERROR.RETRY_LATER);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex w-full flex-col gap-4 p-6">
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <EmailField
            {...field}
            id="email"
            required
            label={LOGIN_FORM_MESSAGES.FIELD.EMAIL_LABEL}
            placeholder={LOGIN_FORM_MESSAGES.FIELD.EMAIL_PLACEHOLDER}
            error={fieldState.invalid}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <PasswordField
            {...field}
            id="password"
            required
            label={LOGIN_FORM_MESSAGES.FIELD.PASSWORD_LABEL}
            placeholder={LOGIN_FORM_MESSAGES.FIELD.PASSWORD_PLACEHOLDER}
            error={fieldState.invalid}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <div className="min-h-5">
        {authErrorMessage ? (
          <p className="text-error-600 text-sm">{authErrorMessage}</p>
        ) : (
          <span className="text-sm text-transparent" aria-hidden="true">
            .
          </span>
        )}
      </div>

      <Button type="submit" disabled={isSubmitDisabled}>
        {LOGIN_FORM_MESSAGES.BUTTON.SUBMIT}
      </Button>
    </form>
  );
}
