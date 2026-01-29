import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { type ApiError, type ApiResponse, getHttpClient } from '@/src/shared/api';

import { NOTIFICATIONS_QUERY_KEYS } from '../config/query-keys';
import type { NotificationsReadRequest } from '../model/types';

type NotificationsReadResponse = ApiResponse<Record<string, never>>;

async function markNotificationsRead(payload: NotificationsReadRequest): Promise<void> {
  const client = getHttpClient({ requiresAuth: true });
  await client.post<NotificationsReadResponse>('/users/me/notifications', payload);
}

export type NotificationsReadMutationOptions = Omit<
  UseMutationOptions<void, ApiError, NotificationsReadRequest>,
  'mutationFn'
>;

export function useNotificationsReadMutation(options?: NotificationsReadMutationOptions) {
  return useMutation({
    mutationKey: NOTIFICATIONS_QUERY_KEYS.root(),
    mutationFn: markNotificationsRead,
    ...options,
  });
}
