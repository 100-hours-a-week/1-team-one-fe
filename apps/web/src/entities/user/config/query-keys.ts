export const USER_QUERY_KEYS = {
  root: () => ['user'] as const,
  me: () => [...USER_QUERY_KEYS.root(), 'me'] as const,
  byId: (userId: number) => [...USER_QUERY_KEYS.root(), userId] as const,
  updateImage: () => [...USER_QUERY_KEYS.root(), 'update-image'] as const,
  updateNickname: () => [...USER_QUERY_KEYS.root(), 'update-nickname'] as const,
} as const;
