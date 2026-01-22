export const LOGIN_QUERY_KEYS = {
  root: () => ['auth'] as const,
  login: () => [...LOGIN_QUERY_KEYS.root(), 'login'] as const,
} as const;
