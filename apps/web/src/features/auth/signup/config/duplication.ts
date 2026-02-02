export const SIGNUP_DUPLICATION_CODES = {
  EMAIL: 'USER_EMAIL_DUPLICATED',
  NICKNAME: 'USER_NICKNAME_DUPLICATED',
} as const;

export const SIGNUP_DUPLICATION_REASONS = {
  EMAIL: 'email already in use',
  NICKNAME: 'nickname already in use',
} as const;
