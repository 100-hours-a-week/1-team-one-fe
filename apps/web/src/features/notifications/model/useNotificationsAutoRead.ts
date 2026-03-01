import { type InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useNotificationsReadMutation } from '../api/notifications-mutation';
import { NOTIFICATIONS_QUERY_KEYS } from '../config/query-keys';
import { getNotificationIdRange, hasUnreadNotifications } from '../lib/notifications-read';
import type { NotificationsPage } from './types';

type UseNotificationsAutoReadOptions = {
  limit: number;
};

const isSameQueryKey = (queryKey: readonly unknown[], targetKey: readonly unknown[]): boolean => {
  if (queryKey.length !== targetKey.length) return false;
  return queryKey.every((value, index) => value === targetKey[index]);
};

export function useNotificationsAutoRead({ limit }: UseNotificationsAutoReadOptions) {
  const queryClient = useQueryClient();
  const lastHandledUpdatedAtRef = useRef(0);
  const lastProcessedPageCountRef = useRef(0);
  const { mutate } = useNotificationsReadMutation();

  useEffect(() => {
    const notificationsListQueryKey = NOTIFICATIONS_QUERY_KEYS.list(limit);
    const cache = queryClient.getQueryCache();

    const unsubscribe = cache.subscribe((event) => {
      const query = event?.query;
      if (!query) return;
      if (!isSameQueryKey(query.queryKey, notificationsListQueryKey)) return;

      if (event.type === 'observerAdded') {
        const payload = query.state.data as InfiniteData<NotificationsPage> | undefined;
        lastProcessedPageCountRef.current = payload?.pages?.length ?? 0;
        const dataUpdatedAt = query.state.dataUpdatedAt;
        if (!dataUpdatedAt) return;
        lastHandledUpdatedAtRef.current = dataUpdatedAt;
        return;
      }

      if (event.type !== 'updated') return;
      if (event.action?.type !== 'success') return;
      if (query.state.status !== 'success') return;

      const dataUpdatedAt = query.state.dataUpdatedAt;
      if (!dataUpdatedAt) return;
      if (lastHandledUpdatedAtRef.current === dataUpdatedAt) return;
      lastHandledUpdatedAtRef.current = dataUpdatedAt;

      const payload = query.state.data as InfiniteData<NotificationsPage> | undefined;
      if (!payload?.pages?.length) return;

      if (payload.pages.length < lastProcessedPageCountRef.current) {
        lastProcessedPageCountRef.current = 0;
      }

      const startIndex = lastProcessedPageCountRef.current;
      const newPages = payload.pages.slice(startIndex);
      if (!newPages.length) return;

      newPages.forEach((page) => {
        const notifications = page.notifications;
        if (!notifications.length) return;
        if (!hasUnreadNotifications(notifications)) return;

        const idRange = getNotificationIdRange(notifications);
        if (!idRange) return;

        mutate(
          { latestNotificationId: idRange.latestId, oldestNotificationId: idRange.oldestId },
          {
            onSuccess: () => {
              queryClient.setQueryData<InfiniteData<NotificationsPage>>(
                notificationsListQueryKey,
                (prev) => {
                  if (!prev) return prev;

                  const pages = prev.pages.map((prevPage) => ({
                    ...prevPage,
                    notifications: prevPage.notifications.map((notification) => {
                      if (notification.notificationId < idRange.minId) return notification;
                      if (notification.notificationId > idRange.maxId) return notification;
                      if (notification.isRead) return notification;
                      return { ...notification, isRead: true };
                    }),
                  }));

                  return { ...prev, pages };
                },
              );
              void queryClient.invalidateQueries({
                queryKey: NOTIFICATIONS_QUERY_KEYS.unreadCount(),
              });
            },
          },
        );
      });

      lastProcessedPageCountRef.current = payload.pages.length;
    });

    return unsubscribe;
  }, [limit, mutate, queryClient]);
}
