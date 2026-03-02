import type { ApiResponse } from '@/src/shared/api';

export interface Tokens {
  accessToken: { token: string; expiresAt: string };
  refreshToken: { token: string; expiresAt: string };
}

export type RefreshResponse = ApiResponse<{ tokens: Tokens }>;

export type ProxyResponse = ApiResponse<Record<string, unknown>>;
