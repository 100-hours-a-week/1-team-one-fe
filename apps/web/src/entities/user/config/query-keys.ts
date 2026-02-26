export const USER_QUERY_KEYS = {
  root: () => ['user'] as const,
  byId: (userId: number) => [...USER_QUERY_KEYS.root(), userId] as const,
} as const;
