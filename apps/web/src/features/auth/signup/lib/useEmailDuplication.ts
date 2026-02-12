import type { Control, UseFormClearErrors, UseFormSetError } from 'react-hook-form';

import { useEmailAvailabilityQuery } from '../api';
import { FORM_MESSAGES } from '../config/form-messages';
import type { SignupFormValues } from '../model/signup-schema';
import { useDuplicationCheck } from './useDuplicationCheck';

export function useEmailDuplication(
  control: Control<SignupFormValues>,
  setError: UseFormSetError<SignupFormValues>,
  clearErrors: UseFormClearErrors<SignupFormValues>,
) {
  return useDuplicationCheck({
    control,
    setError,
    clearErrors,
    field: 'email',
    messages: {
      required: FORM_MESSAGES.ERROR.EMAIL_DUP_CHECK_REQUIRED,
      checking: FORM_MESSAGES.STATUS.DUP_CHECKING,
      available: FORM_MESSAGES.STATUS.EMAIL_AVAILABLE,
      unavailable: FORM_MESSAGES.ERROR.EMAIL_UNAVAILABLE,
      failed: FORM_MESSAGES.ERROR.EMAIL_DUP_CHECK_FAILED,
    },
    useAvailabilityQuery: useEmailAvailabilityQuery,
  });
}
