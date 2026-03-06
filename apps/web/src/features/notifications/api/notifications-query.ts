import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import {
  type NotificationsInfiniteQueryOptions,
  notificationsInfiniteQueryOptions,
  unreadNotificationsCountQueryOptions,
} from './query-options';

export function useNotificationsInfiniteQuery(
  limit: number,
  options?: NotificationsInfiniteQueryOptions,
) {
  return useInfiniteQuery({
    ...notificationsInfiniteQueryOptions(limit),
    ...options,
  });
}

export function useUnreadNotificationsCountQuery() {
  return useQuery({
    ...unreadNotificationsCountQueryOptions(),
  });
}
