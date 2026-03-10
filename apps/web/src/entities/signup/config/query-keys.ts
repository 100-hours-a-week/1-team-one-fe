export const SIGNUP_QUERY_KEYS = {
  root: () => ['auth'] as const,
  emailAvailability: (email: string) =>
    [...SIGNUP_QUERY_KEYS.root(), 'email-availability', email] as const,
  nicknameAvailability: (nickname: string) =>
    [...SIGNUP_QUERY_KEYS.root(), 'nickname-availability', nickname] as const,
  signup: () => [...SIGNUP_QUERY_KEYS.root(), 'sign-up'] as const,
} as const;
