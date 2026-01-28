/**
 * 쿠키명 / refresh 경로 / 옵션
 */
export const AUTH_CONFIG = {
  ACCESS_TOKEN_COOKIE: 'accessToken',
  REFRESH_TOKEN_COOKIE: 'refreshToken',
  REFRESH_ENDPOINT: '/auth/refresh',
  COOKIE_PATH: '/',
  COOKIE_SAME_SITE: 'lax',
  LOGIN_ENDPOINT: '/auth/login',
} as const;
