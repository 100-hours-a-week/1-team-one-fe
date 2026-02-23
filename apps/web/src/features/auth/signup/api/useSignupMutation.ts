import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { type SignupDataType, type SignupRequestDTO, signupRequestFn } from '@/src/entities/signup';
import { type ApiError } from '@/src/shared/api';

import { AUTH_QUERY_KEYS } from '../config/query-keys';

export type SignupMutationOptions = Omit<
  UseMutationOptions<SignupDataType, ApiError, SignupRequestDTO>,
  'mutationFn'
>;

export function useSignupMutation(options?: SignupMutationOptions) {
  return useMutation({
    mutationKey: AUTH_QUERY_KEYS.signup(),
    mutationFn: signupRequestFn,
    ...options,
    meta: { ...options?.meta, disableToast: true },
  });
}
