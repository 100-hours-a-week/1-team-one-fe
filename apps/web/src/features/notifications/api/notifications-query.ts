import {
  type InfiniteData,
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
  useQuery,
} from '@tanstack/react-query';

import { type ApiError, type ApiResponse, getHttpClient } from '@/src/shared/api';

import { NOTIFICATIONS_QUERY_KEYS } from '../config/query-keys';
import type {
  NotificationLogItem,
  NotificationsPage,
  NotificationsPaging,
  UnreadNotificationsCount,
} from '../model/types';

type NotificationsResponse = ApiResponse<{
  notifications: NotificationLogItem[];
}> & {
  paging: NotificationsPaging;
};

type UnreadCountResponse = ApiResponse<UnreadNotificationsCount>;

const toNotificationsPage = (response: NotificationsResponse): NotificationsPage => ({
  notifications: response.data.notifications,
  paging: response.paging,
});

async function fetchNotificationsPage(
  limit: number,
  cursor?: string | null,
): Promise<NotificationsPage> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<NotificationsResponse>('/users/me/notifications', {
    params: {
      limit,
      cursor: cursor ?? undefined,
    },
  });

  return toNotificationsPage(response.data);
}

export type NotificationsInfiniteQueryKey = ReturnType<typeof NOTIFICATIONS_QUERY_KEYS.list>;

export type NotificationsInfiniteQueryOptions = Omit<
  UseInfiniteQueryOptions<
    NotificationsPage,
    ApiError,
    InfiniteData<NotificationsPage>,
    NotificationsInfiniteQueryKey,
    string | null
  >,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
>;

export function useNotificationsInfiniteQuery(
  limit: number,
  options?: NotificationsInfiniteQueryOptions,
) {
  return useInfiniteQuery({
    queryKey: NOTIFICATIONS_QUERY_KEYS.list(limit),
    queryFn: ({ pageParam }) => fetchNotificationsPage(limit, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.paging?.hasNext) return undefined;
      return lastPage.paging.nextCursor;
    },
    ...options,
  });
}

async function fetchUnreadCount(): Promise<UnreadNotificationsCount> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<UnreadCountResponse>('/users/me/notifications/unread_count');

  return response.data.data;
}

export function useUnreadNotificationsCountQuery() {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEYS.unreadCount(),
    queryFn: fetchUnreadCount,
  });
}
