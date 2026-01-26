export const PUSH_NOTIFICATIONS_QUERY_KEYS = {
  root: () => ['push-notifications'] as const,
  putToken: () => [...PUSH_NOTIFICATIONS_QUERY_KEYS.root(), 'put-token'] as const,
} as const;
