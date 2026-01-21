import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { isApiError } from '@/src/shared/mock-api';

import { EmailField, NicknameField, PasswordField } from '../../ui';
import { checkEmailDuplication, checkNicknameDuplication } from '../api';
import { FORM_MESSAGES } from '../config/form-messages';
import { useEmailDuplication } from '../lib/use-email-duplication';
import { useNicknameDuplication } from '../lib/use-nickname-duplication';
import { type SignupFormValues, signupSchema } from '../model/signup-schema';

export interface SignupFormProps {
  onSubmit: (values: SignupFormValues) => Promise<void>;
  isPending?: boolean;
}

export function SignupForm({ onSubmit, isPending }: SignupFormProps) {
  const { control, handleSubmit, formState, setError, clearErrors } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      nickname: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const emailDup = useEmailDuplication(control, checkEmailDuplication, setError, clearErrors);
  const nicknameDup = useNicknameDuplication(
    control,
    checkNicknameDuplication,
    setError,
    clearErrors,
  );

  const handleFormSubmit = async (values: SignupFormValues) => {
    //TODO: early return
    if (emailDup.state.status !== 'available') {
      setError('email', {
        type: 'manual',
        message: FORM_MESSAGES.EMAIL.DUP_CHECK_REQUIRED,
      });
      return;
    }

    if (nicknameDup.state.status !== 'available') {
      setError('nickname', {
        type: 'manual',
        message: FORM_MESSAGES.NICKNAME.DUP_CHECK_REQUIRED,
      });
      return;
    }
    //TODO: react query 연결 후 리팩토링
    try {
      await onSubmit(values);
    } catch (error: unknown) {
      if (isApiError(error) && error.errors) {
        error.errors.forEach((err) => {
          setError(err.field as keyof SignupFormValues, {
            type: 'server',
            message: err.reason,
          });
        });
      } else {
        setError('root.serverError', {
          type: 'server',
          message: FORM_MESSAGES.ERROR.SIGNUP_FAILED,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* TODO: 설정 모아서 map 으로 변경 */}
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <EmailField
            {...field}
            id="email"
            required
            error={fieldState.invalid}
            errorMessage={fieldState.error?.message}
            duplicationCheck={{
              enabled: true,
              status: emailDup.state.status,
              message: emailDup.state.message,
              buttonText: FORM_MESSAGES.BUTTON.DUP_CHECK,
              disabled:
                !field.value ||
                (fieldState.invalid &&
                  !['server', 'duplicate', 'server-validation'].includes(
                    fieldState.error?.type ?? '',
                  )),
              onCheck: emailDup.handleCheck,
            }}
          />
        )}
      />

      <Controller
        name="nickname"
        control={control}
        render={({ field, fieldState }) => (
          <NicknameField
            {...field}
            id="nickname"
            required
            error={fieldState.invalid}
            errorMessage={fieldState.error?.message}
            duplicationCheck={{
              enabled: true,
              status: nicknameDup.state.status,
              message: nicknameDup.state.message,
              buttonText: FORM_MESSAGES.BUTTON.DUP_CHECK,
              disabled:
                !field.value ||
                (fieldState.invalid &&
                  !['server', 'duplicate', 'server-validation'].includes(
                    fieldState.error?.type ?? '',
                  )),
              onCheck: nicknameDup.handleCheck,
            }}
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
            label={FORM_MESSAGES.PASSWORD.LABEL}
            autoComplete="new-password"
            required
            error={fieldState.invalid}
            errorMessage={fieldState.error?.message}
            helperText={FORM_MESSAGES.PASSWORD.HELPER_TEXT}
          />
        )}
      />

      <Controller
        name="passwordConfirm"
        control={control}
        render={({ field, fieldState }) => (
          <PasswordField
            {...field}
            id="passwordConfirm"
            label={FORM_MESSAGES.PASSWORD.CONFIRM_LABEL}
            autoComplete="new-password"
            required
            error={fieldState.invalid}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      {formState.errors.root?.serverError && (
        <p className="text-error-600 text-sm">{formState.errors.root.serverError.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending || formState.isSubmitting}
        className="bg-brand-600 hover:bg-brand-700 w-full rounded-md px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending || formState.isSubmitting
          ? FORM_MESSAGES.BUTTON.SUBMIT_PENDING
          : FORM_MESSAGES.BUTTON.SUBMIT_DEFAULT}
      </button>
    </form>
  );
}
