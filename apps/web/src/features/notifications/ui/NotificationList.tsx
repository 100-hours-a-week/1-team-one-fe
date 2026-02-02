import { LOADING_CONFIG } from '@/src/shared/config/loading';
import {
  formatNotificationDateLabel,
  getNotificationDateKey,
} from '@/src/shared/lib/date/notification-date';
import { useDelayedValue } from '@/src/shared/lib/loading';

import { NOTIFICATIONS_CONFIG } from '../config/constants';
import { NOTIFICATIONS_MESSAGES } from '../config/messages';
import type { NotificationLogItem } from '../model/types';
import { InfiniteScrollTrigger } from './InfiniteScrollTrigger';
import { NotificationItem } from './NotificationItem';
import { NotificationListSkeleton } from './NotificationList.skeleton';

type NotificationListProps = {
  items: NotificationLogItem[];
  isLoading: boolean;
  error?: Error | null | unknown;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onFetchNext: () => void;
};

export function NotificationList({
  items,
  isLoading,
  error,
  isFetchingNextPage,
  hasNextPage,
  onFetchNext,
}: NotificationListProps) {
  const shouldShowLoading = useDelayedValue(isLoading, LOADING_CONFIG.DEFAULT_DELAY);
  const shouldShowBlockingError = Boolean(error) && items.length === 0;
  const shouldShowWarning = Boolean(error) && items.length > 0;

  if (isLoading && shouldShowLoading) {
    return <NotificationListSkeleton />;
  }

  if (isLoading && !shouldShowLoading) {
    return null;
  }

  if (shouldShowBlockingError) {
    return (
      <div className="text-error-600 flex justify-center py-8 text-sm">
        {NOTIFICATIONS_MESSAGES.LIST.ERROR}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-text-muted flex justify-center py-8 text-sm">
        {NOTIFICATIONS_MESSAGES.LIST.EMPTY}
      </div>
    );
  }

  //날짜로 그룹화
  const grouped = items.reduce<
    {
      dateKey: string;
      label: string;
      items: NotificationLogItem[];
    }[]
  >((acc, item) => {
    const dateKey = getNotificationDateKey(item.createdAt);
    const lastGroup = acc[acc.length - 1];
    if (!lastGroup || lastGroup.dateKey !== dateKey) {
      acc.push({
        dateKey,
        label: formatNotificationDateLabel(item.createdAt),
        items: [item],
      });
      return acc;
    }

    lastGroup.items.push(item);
    return acc;
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {shouldShowWarning && (
        <div className="text-error-600 text-xs" role="status">
          {NOTIFICATIONS_MESSAGES.LIST.WARNING}
        </div>
      )}
      {grouped.map((group) => (
        <div key={group.dateKey} className="flex flex-col gap-3">
          <span className="text-text-muted text-xs font-semibold">{group.label}</span>
          {group.items.map((item) => (
            <NotificationItem key={item.notificationId} item={item} />
          ))}
        </div>
      ))}
      {isFetchingNextPage && (
        <div className="text-text-muted flex justify-center text-sm">
          {NOTIFICATIONS_MESSAGES.LIST.FETCHING_MORE}
        </div>
      )}
      <InfiniteScrollTrigger
        isActive={hasNextPage && !isFetchingNextPage}
        onIntersect={onFetchNext}
        rootMargin={NOTIFICATIONS_CONFIG.INFINITE_SCROLL_ROOT_MARGIN}
      />
    </div>
  );
}
