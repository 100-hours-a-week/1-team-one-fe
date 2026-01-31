export const LOGOUT_QUERY_KEYS = {
  root: () => ['auth'] as const,
  logout: () => [...LOGOUT_QUERY_KEYS.root(), 'logout'] as const,
} as const;
