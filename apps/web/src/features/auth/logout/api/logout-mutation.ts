import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { type ApiError, getHttpClient } from '@/src/shared/api';

import { LOGOUT_QUERY_KEYS } from '../config/query-keys';
import type { LogoutData, LogoutResponse } from './types';

async function logoutRequest(): Promise<LogoutData> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.post<LogoutResponse>('/auth/logout');

  return response.data.data;
}

export type LogoutMutationOptions = Omit<
  UseMutationOptions<LogoutData, ApiError, void>,
  'mutationFn'
>;

export function useLogoutMutation(options?: LogoutMutationOptions) {
  return useMutation({
    mutationKey: LOGOUT_QUERY_KEYS.logout(),
    mutationFn: logoutRequest,
    ...options,
  });
}
