import type { Control, UseFormClearErrors, UseFormSetError } from 'react-hook-form';

import { useNicknameAvailabilityQuery } from '../api';
import { FORM_MESSAGES } from '../config/form-messages';
import type { SignupFormValues } from '../model/signup-schema';
import { useDuplicationCheck } from './useDuplicationCheck';

export function useNicknameDuplication(
  control: Control<SignupFormValues>,
  setError: UseFormSetError<SignupFormValues>,
  clearErrors: UseFormClearErrors<SignupFormValues>,
) {
  return useDuplicationCheck({
    control,
    setError,
    clearErrors,
    field: 'nickname',
    messages: {
      required: FORM_MESSAGES.ERROR.NICKNAME_DUP_CHECK_REQUIRED,
      checking: FORM_MESSAGES.STATUS.DUP_CHECKING,
      available: FORM_MESSAGES.STATUS.NICKNAME_AVAILABLE,
      unavailable: FORM_MESSAGES.ERROR.NICKNAME_UNAVAILABLE,
      failed: FORM_MESSAGES.ERROR.NICKNAME_DUP_CHECK_FAILED,
    },
    useAvailabilityQuery: useNicknameAvailabilityQuery,
  });
}
