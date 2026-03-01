import { useMemo } from 'react';

import {
  NotificationList,
  useNotificationsAutoRead,
  useNotificationsInfiniteQuery,
} from '@/src/features/notifications';
import { NOTIFICATIONS_CONFIG } from '@/src/features/notifications/config/constants';
import { NOTIFICATIONS_MESSAGES } from '@/src/features/notifications/config/messages';
import { LoadableBoundary } from '@/src/shared/ui/boundary';

import { NotificationsListSectionSkeleton } from './NotificationsListSection.skeleton';

export function NotificationsListSection() {
  useNotificationsAutoRead({ limit: NOTIFICATIONS_CONFIG.PAGE_LIMIT });

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useNotificationsInfiniteQuery(NOTIFICATIONS_CONFIG.PAGE_LIMIT, {
      refetchOnWindowFocus: NOTIFICATIONS_CONFIG.REFETCH_ON_WINDOW_FOCUS,
      refetchOnReconnect: NOTIFICATIONS_CONFIG.REFETCH_ON_RECONNECT,
      refetchOnMount: NOTIFICATIONS_CONFIG.REFETCH_ON_MOUNT,
    });

  const notifications = useMemo(
    () => data?.pages?.flatMap((page) => page.notifications) ?? [],
    [data],
  );
  const hasData = Boolean(data);
  const resolvedNotifications = hasData ? notifications : undefined;
  const isEmpty = hasData && notifications.length === 0;

  return (
    <LoadableBoundary
      isLoading={isLoading}
      error={error}
      data={resolvedNotifications}
      isEmpty={isEmpty}
      renderLoading={() => <NotificationsListSectionSkeleton />}
      renderError={() => null}
      renderEmpty={() => (
        <div className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-6">
          <div className="text-text-muted flex justify-center py-8 text-sm">
            {NOTIFICATIONS_MESSAGES.LIST.EMPTY}
          </div>
        </div>
      )}
    >
      {(items) => (
        <div className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-6">
          <NotificationList
            items={items}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={Boolean(hasNextPage)}
            onFetchNext={() => void fetchNextPage()}
          />
        </div>
      )}
    </LoadableBoundary>
  );
}
