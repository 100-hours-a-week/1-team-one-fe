import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { type LoginDataType, type LoginRequestDTO, loginRequestFn } from '@/src/entities/login';
import { type ApiError } from '@/src/shared/api';

import { LOGIN_QUERY_KEYS } from '../config/query-keys';

export type LoginMutationOptions = Omit<
  UseMutationOptions<LoginDataType, ApiError, LoginRequestDTO>,
  'mutationFn'
>;

export function useLoginMutation(options?: LoginMutationOptions) {
  return useMutation({
    mutationKey: LOGIN_QUERY_KEYS.login(),
    mutationFn: loginRequestFn,
    ...options,
    meta: { ...options?.meta, disableToast: true },
  });
}
