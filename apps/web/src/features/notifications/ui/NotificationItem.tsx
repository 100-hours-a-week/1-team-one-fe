import { Card } from '@repo/ui/card';
import { Chip } from '@repo/ui/chip';

import { formatNotificationTimeLabel } from '@/src/shared/lib/date/notification-date';

import { NOTIFICATIONS_MESSAGES } from '../config/messages';
import type { NotificationLogItem } from '../model/types';

type NotificationItemProps = {
  item: NotificationLogItem;
};

export function NotificationItem({ item }: NotificationItemProps) {
  const detailText = item.details ?? NOTIFICATIONS_MESSAGES.META.DETAILS_EMPTY;
  const timeLabel = formatNotificationTimeLabel(item.createdAt);

  return (
    <Card
      padding="md"
      variant={item.isRead ? 'elevated' : 'disabled'}
      className="flex flex-col gap-3"
    >
      <div className="flex gap-3">
        <Chip label={timeLabel} size="sm" variant="date" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-text text-sm font-semibold">{item.content}</span>
          </div>
          <p className="text-text-muted text-sm">{detailText}</p>
        </div>
      </div>
    </Card>
  );
}
