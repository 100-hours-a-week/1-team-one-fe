import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import type { ApiResponse } from '@/src/shared/api';
import { type ApiError } from '@/src/shared/api';
import { getHttpClient } from '@/src/shared/api';

import { PUSH_NOTIFICATIONS_QUERY_KEYS } from '../config/query-keys';

export interface PutFcmTokenRequest {
  fcmToken: string;
}

type PutFcmTokenResponse = ApiResponse<Record<string, unknown>>;

export type PutFcmTokenMutationOptions = Omit<
  UseMutationOptions<void, ApiError, PutFcmTokenRequest>,
  'mutationFn'
>;

export async function putFcmToken(payload: PutFcmTokenRequest): Promise<void> {
  const client = getHttpClient({ requiresAuth: true });
  await client.put<PutFcmTokenResponse>('/auth/fcm', payload);
}

export function usePutFcmTokenMutation(options?: PutFcmTokenMutationOptions) {
  return useMutation({
    mutationKey: PUSH_NOTIFICATIONS_QUERY_KEYS.putToken(),
    mutationFn: putFcmToken,
    ...options,
  });
}
