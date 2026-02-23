import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/button';
import { InputImage } from '@repo/ui/input-image';
import { Controller, useForm, type UseFormSetError } from 'react-hook-form';

import { type ApiError, isApiError } from '@/src/shared/api';
import { useClearFieldErrorsOnChange } from '@/src/shared/lib/form/useClearFieldErrorsOnChange';

import { EmailField, NicknameField, PasswordField } from '../../ui';
import { PROFILE_IMAGE_UPLOAD_ERROR_CODE } from '../api';
import { FORM_MESSAGES } from '../config/form-messages';
import { VALIDATION_RULES } from '../config/validation';
import { useEmailDuplication } from '../lib/useEmailDuplication';
import { useNicknameDuplication } from '../lib/useNicknameDuplication';
import { type SignupFormValues, signupSchema } from '../model/signup-schema';

export interface SignupFormProps {
  onSubmit: (values: SignupFormValues) => Promise<void>;
  isPending?: boolean;
  isProfileImageUploading?: boolean;
}

export function SignupForm({ onSubmit, isPending, isProfileImageUploading }: SignupFormProps) {
  const { control, handleSubmit, formState, setError, clearErrors } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      profileImage: null,
      email: '',
      nickname: '',
      password: '',
      passwordConfirm: '',
    },
  });

  useClearFieldErrorsOnChange({
    control,
    errors: formState.errors,
    clearErrors,
    fields: SIGNUP_FIELDS,
  });

  const emailDup = useEmailDuplication(control, setError, clearErrors);
  const nicknameDup = useNicknameDuplication(control, setError, clearErrors);
  const isSubmitLoading = Boolean(isPending || formState.isSubmitting);

  const handleFormSubmit = async (values: SignupFormValues) => {
    const isEmailAvailable = emailDup.state.status === 'available';
    const isNicknameAvailable = nicknameDup.state.status === 'available';

    if (!isEmailAvailable) {
      setError('email', {
        type: 'dup-check-required',
        message: FORM_MESSAGES.ERROR.EMAIL_DUP_CHECK_REQUIRED,
      });
    }

    if (!isNicknameAvailable) {
      setError('nickname', {
        type: 'dup-check-required',
        message: FORM_MESSAGES.ERROR.NICKNAME_DUP_CHECK_REQUIRED,
      });
    }

    if (!isEmailAvailable || !isNicknameAvailable) return;
    try {
      await onSubmit(values);
    } catch (error: unknown) {
      const setRootError = (message: string) => {
        setError('root.serverError', { type: 'server', message });
      };

      const uploadErrorMessage = getProfileImageUploadErrorMessage(error);
      if (uploadErrorMessage) {
        setError('profileImage', {
          type: 'server',
          message: uploadErrorMessage,
        });
        return;
      }

      if (!isApiError(error)) {
        setRootError(FORM_MESSAGES.ERROR.SIGNUP_FAILED);
        return;
      }

      const mapped = applyApiErrors(error, setError);
      if (mapped) return;

      setRootError(error.message || FORM_MESSAGES.ERROR.SIGNUP_FAILED);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex w-full flex-col justify-center gap-6"
    >
      {/* TODO: 설정 모아서 맵으로 변경 */}
      <Controller
        name="profileImage"
        control={control}
        render={({ field, fieldState }) => (
          <InputImage
            name={field.name}
            value={field.value}
            accept={VALIDATION_RULES.PROFILE_IMAGE_ACCEPT}
            label={FORM_MESSAGES.FIELD.PROFILE_IMAGE_LABEL}
            helperText={FORM_MESSAGES.FIELD.PROFILE_IMAGE_HELPER}
            clearLabel={FORM_MESSAGES.FIELD.PROFILE_IMAGE_CLEAR}
            clearAriaLabel={FORM_MESSAGES.FIELD.PROFILE_IMAGE_CLEAR_ARIA}
            onChange={(file) => field.onChange(file)}
            onBlur={field.onBlur}
            onClear={() => field.onChange(null)}
            isLoading={isProfileImageUploading}
            error={fieldState.invalid}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

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
              buttonText: '중복 확인',
              disabled:
                !field.value ||
                (fieldState.invalid &&
                  !['server', 'duplicate', 'server-validation', 'dup-check-required'].includes(
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
              buttonText: '중복 확인',
              disabled:
                !field.value ||
                (fieldState.invalid &&
                  !['server', 'duplicate', 'server-validation', 'dup-check-required'].includes(
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
            label="비밀번호"
            autoComplete="new-password"
            required
            error={fieldState.invalid}
            errorMessage={fieldState.error?.message}
            helperText="최소 8자 이상 입력해주세요."
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
            label="비밀번호 확인"
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

      <Button type="submit" fullWidth isLoading={isSubmitLoading}>
        {isSubmitLoading ? '처리 중' : '회원가입'}
      </Button>
    </form>
  );
}

const PROFILE_IMAGE_ERROR_FIELDS = new Set(['fileName', 'contentType']);
const PROFILE_IMAGE_ERROR_CODES = new Set([
  'INVALID_FILE_EXTENSION',
  'PRESIGNED_URL_GENERATION_FAILED',
]);
const SIGNUP_FIELDS = [
  'profileImage',
  'email',
  'nickname',
  'password',
  'passwordConfirm',
] as const satisfies ReadonlyArray<keyof SignupFormValues>;
const SIGNUP_FIELD_SET = new Set<keyof SignupFormValues>(SIGNUP_FIELDS);

function isSignupField(field: string | undefined): field is keyof SignupFormValues {
  if (!field) return false;
  return SIGNUP_FIELD_SET.has(field as keyof SignupFormValues);
}

function applyApiErrors(error: ApiError, setError: UseFormSetError<SignupFormValues>) {
  if (Array.isArray(error.errors) && error.errors.length > 0) {
    let handled = false;

    for (const err of error.errors) {
      if (isSignupField(err.field)) {
        setError(err.field, { type: 'server', message: err.reason });
        handled = true;
        continue;
      }

      if (err.field && PROFILE_IMAGE_ERROR_FIELDS.has(err.field)) {
        setError('profileImage', { type: 'server', message: err.reason });
        handled = true;
        continue;
      }
    }

    if (handled) return true;
  }

  if (error.code && PROFILE_IMAGE_ERROR_CODES.has(error.code)) {
    setError('profileImage', { type: 'server', message: error.message });
    return true;
  }

  return false;
}

function getProfileImageUploadErrorMessage(error: unknown) {
  if (!(error instanceof Error)) return null;
  if (!error.message.startsWith(PROFILE_IMAGE_UPLOAD_ERROR_CODE)) return null;

  const payload = error.message.replace(`${PROFILE_IMAGE_UPLOAD_ERROR_CODE}:`, '');
  if (!payload) return FORM_MESSAGES.ERROR.PROFILE_IMAGE_UPLOAD_FAILED;

  const [status = FORM_MESSAGES.ERROR.PROFILE_IMAGE_UPLOAD_STATUS_UNKNOWN, ...rest] =
    payload.split(':');
  const detail = rest.join(':').trim();
  const baseMessage = FORM_MESSAGES.ERROR.PROFILE_IMAGE_UPLOAD_FAILED_WITH_STATUS.replace(
    '{status}',
    status,
  );

  if (!detail) return baseMessage;
  return `${baseMessage} ${detail}`;
}
