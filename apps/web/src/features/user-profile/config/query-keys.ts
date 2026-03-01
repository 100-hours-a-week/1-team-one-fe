export const USER_PROFILE_QUERY_KEYS = {
  root: () => ['user-profile'] as const,
  me: () => [...USER_PROFILE_QUERY_KEYS.root(), 'me'] as const,
  updateImage: () => [...USER_PROFILE_QUERY_KEYS.root(), 'update-image'] as const,
  updateNickname: () => [...USER_PROFILE_QUERY_KEYS.root(), 'update-nickname'] as const,
} as const;
