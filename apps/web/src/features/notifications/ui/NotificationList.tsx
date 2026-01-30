import {
  formatNotificationDateLabel,
  getNotificationDateKey,
} from '@/src/shared/lib/date/notification-date';

import { NOTIFICATIONS_CONFIG } from '../config/constants';
import { NOTIFICATIONS_MESSAGES } from '../config/messages';
import type { NotificationLogItem } from '../model/types';
import { InfiniteScrollTrigger } from './InfiniteScrollTrigger';
import { NotificationItem } from './NotificationItem';

type NotificationListProps = {
  items: NotificationLogItem[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onFetchNext: () => void;
};

export function NotificationList({
  items,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onFetchNext,
}: NotificationListProps) {
  if (isLoading) {
    return (
      <div className="text-text-muted flex justify-center py-8 text-sm">
        {NOTIFICATIONS_MESSAGES.LIST.LOADING}
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
