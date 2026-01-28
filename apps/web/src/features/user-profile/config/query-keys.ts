export const USER_PROFILE_QUERY_KEYS = {
  root: () => ['user-profile'] as const,
  me: () => [...USER_PROFILE_QUERY_KEYS.root(), 'me'] as const,
} as const;
