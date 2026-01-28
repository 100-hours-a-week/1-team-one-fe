import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { type ApiError, getHttpClient } from '@/src/shared/api';

import { LOGIN_QUERY_KEYS } from '../config/query-keys';
import type { LoginData, LoginRequest, LoginResponse } from './types';

async function loginRequest(payload: LoginRequest): Promise<LoginData> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.post<LoginResponse>('/auth/login', payload);

  return response.data.data;
}

export type LoginMutationOptions = Omit<
  UseMutationOptions<LoginData, ApiError, LoginRequest>,
  'mutationFn'
>;

export function useLoginMutation(options?: LoginMutationOptions) {
  return useMutation({
    mutationKey: LOGIN_QUERY_KEYS.login(),
    mutationFn: loginRequest,
    ...options,
  });
}
