import {
  formatNotificationDateLabel,
  getNotificationDateKey,
} from '@/src/shared/lib/date/notification-date';
import { withGroupedList } from '@/src/shared/ui/grouped-list';
import { InfiniteScrollTrigger } from '@/src/shared/ui/infinite-scroll-trigger';

import { NOTIFICATIONS_CONFIG } from '../config/constants';
import { NOTIFICATIONS_MESSAGES } from '../config/messages';
import type { NotificationLogItem } from '../model/types';
import { NotificationItem } from './NotificationItem';

type NotificationListProps = {
  items: NotificationLogItem[];
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onFetchNext: () => void;
};

const GroupedNotificationItems = withGroupedList(NotificationItem, {
  getGroupKey: (item) => getNotificationDateKey(item.createdAt),
  getGroupLabel: (item) => formatNotificationDateLabel(item.createdAt),
  getItemKey: (item) => item.notificationId,
});

export function NotificationList({
  items,
  isFetchingNextPage,
  hasNextPage,
  onFetchNext,
}: NotificationListProps) {
  return (
    <div className="flex flex-col gap-3">
      <GroupedNotificationItems items={items} />
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
