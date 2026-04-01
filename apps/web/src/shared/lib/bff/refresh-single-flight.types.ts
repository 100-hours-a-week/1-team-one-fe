import type { RefreshTokensResult, Tokens } from './types';

/**
 * leader : 락 잡고 직접 refresh한 요청
 * shared-result: 다른 요청의 결과를 공유받은 요청
 * fallback: redis 를 못 쓰거나 timeout 으로 인해 direct refresh 로 내려간 요청
 */
export type RefreshResultSource = 'leader' | 'shared-result' | 'fallback';

export interface SharedRefreshResult extends RefreshTokensResult {
  createdAt: number;
}

export interface DistributedRefreshTokensResult extends RefreshTokensResult {
  source: RefreshResultSource;
}

export function isTokens(value: unknown): value is Tokens {
  if (typeof value !== 'object' || value === null) return false;
  if (!('accessToken' in value) || !('refreshToken' in value)) return false;

  const accessToken = value.accessToken;
  const refreshToken = value.refreshToken;

  if (typeof accessToken !== 'object' || accessToken === null) return false;
  if (typeof refreshToken !== 'object' || refreshToken === null) return false;
  if (!('token' in accessToken) || !('expiresAt' in accessToken)) return false;
  if (!('token' in refreshToken) || !('expiresAt' in refreshToken)) return false;

  return (
    typeof accessToken.token === 'string' &&
    typeof accessToken.expiresAt === 'string' &&
    typeof refreshToken.token === 'string' &&
    typeof refreshToken.expiresAt === 'string'
  );
}
