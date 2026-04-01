import type { ApiResponse } from '@/src/shared/api';

export interface Tokens {
  accessToken: { token: string; expiresAt: string };
  refreshToken: { token: string; expiresAt: string };
}

export type RefreshResponse = ApiResponse<{ tokens: Tokens }>;

export interface RefreshTokensResult {
  status: number;
  tokens: Tokens | null;
  payload: Record<string, unknown> | null;
}

export type ProxyResponse = Record<string, unknown>;
