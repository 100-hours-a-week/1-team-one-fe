export const NOTIFICATIONS_QUERY_KEYS = {
  root: () => ['notifications'] as const,
  list: (limit: number) => [...NOTIFICATIONS_QUERY_KEYS.root(), 'list', limit] as const,
  unreadCount: () => [...NOTIFICATIONS_QUERY_KEYS.root(), 'unread-count'] as const,
} as const;
