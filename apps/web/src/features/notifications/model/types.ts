export type NotificationLogItem = {
  notificationId: number;
  createdAt: string;
  content: string;
  details: string | null;
  isRead: boolean;
};

export type NotificationsPaging = {
  nextCursor: string | null;
  hasNext: boolean;
};

export type NotificationsPage = {
  notifications: NotificationLogItem[];
  paging: NotificationsPaging;
};

export type NotificationsReadRequest = {
  oldestNotificationId: number;
  latestNotificationId: number;
};

export type UnreadNotificationsCount = {
  unreadCount: number;
};
