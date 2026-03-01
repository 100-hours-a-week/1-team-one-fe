import type { NotificationLogItem } from '../model/types';

export type NotificationIdRange = {
  latestId: number;
  oldestId: number;
  minId: number;
  maxId: number;
};

export const hasUnreadNotifications = (items: NotificationLogItem[]): boolean =>
  items.some((item) => !item.isRead);

export const getNotificationIdRange = (
  items: NotificationLogItem[],
): NotificationIdRange | null => {
  if (items.length === 0) return null;

  const latestId = items[0]?.notificationId;
  const oldestId = items[items.length - 1]?.notificationId;
  if (latestId == null || oldestId == null) return null;

  return {
    latestId,
    oldestId,
    minId: Math.min(latestId, oldestId),
    maxId: Math.max(latestId, oldestId),
  };
};
