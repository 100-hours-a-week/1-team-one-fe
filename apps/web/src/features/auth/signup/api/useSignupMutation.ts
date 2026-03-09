import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import {
  SIGNUP_QUERY_KEYS,
  type SignupDataType,
  type SignupRequestDTO,
  signupRequestFn,
} from '@/src/entities/signup';
import { type ApiError } from '@/src/shared/api';

export type SignupMutationOptions = Omit<
  UseMutationOptions<SignupDataType, ApiError, SignupRequestDTO>,
  'mutationFn'
>;

export function useSignupMutation(options?: SignupMutationOptions) {
  return useMutation({
    mutationKey: SIGNUP_QUERY_KEYS.signup(),
    mutationFn: signupRequestFn,
    ...options,
    meta: { ...options?.meta, disableToast: true },
  });
}
