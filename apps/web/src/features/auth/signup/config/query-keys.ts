export const AUTH_QUERY_KEYS = {
  root: () => ['auth'] as const,
  emailAvailability: (email: string) =>
    [...AUTH_QUERY_KEYS.root(), 'email-availability', email] as const,
  nicknameAvailability: (nickname: string) =>
    [...AUTH_QUERY_KEYS.root(), 'nickname-availability', nickname] as const,
  signup: () => [...AUTH_QUERY_KEYS.root(), 'sign-up'] as const,
} as const;
