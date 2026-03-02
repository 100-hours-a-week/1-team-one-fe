import type { NextApiRequest, NextApiResponse } from 'next';

import { AUTH_CONFIG } from '@/src/shared/config/auth';
import { HTTP_STATUS } from '@/src/shared/config/http-status';
import { parseCookie } from '@/src/shared/lib/cookie/parse-cookie';
import { serializeCookie } from '@/src/shared/lib/cookie/serialize-cookie';

import type { RefreshResponse, Tokens } from './types';

const BEARER_PREFIX = 'Bearer';
const JSON_CONTENT_TYPE = 'application/json';
const REAL_API_PREFIX = '/api';

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * api 응답에서 accessToken, refreshToken 추출
 */
export function extractTokens(payload: unknown): Tokens | null {
  if (!isRecord(payload)) return null;

  const data = payload.data;
  if (!isRecord(data)) return null;

  const tokens = data.tokens;
  if (!isRecord(tokens)) return null;

  const accessToken = tokens.accessToken;
  const refreshToken = tokens.refreshToken;

  if (!isRecord(accessToken) || !isRecord(refreshToken)) return null;

  const accessTokenString = accessToken.token;
  const refreshTokenString = refreshToken.token;

  if (typeof accessTokenString !== 'string' || typeof refreshTokenString !== 'string') return null;

  //TODO: expiresAt 도 검사에 추가 예정
  return {
    accessToken: { token: accessTokenString, expiresAt: '' },
    refreshToken: { token: refreshTokenString, expiresAt: '' },
  };
}

export function stripTokens(payload: unknown): unknown {
  if (!isRecord(payload)) return payload;

  const data = payload.data;
  if (!isRecord(data)) return payload;

  if (!('tokens' in data)) return payload;

  const { tokens: _ignored, ...restData } = data;

  return {
    ...payload,
    data: restData,
  };
}

export function getAccessTokenFromCookies(req: NextApiRequest): string | undefined {
  const cookies = parseCookie(req.headers.cookie);
  return cookies[AUTH_CONFIG.ACCESS_TOKEN_COOKIE];
}

export function getRefreshTokenFromCookies(req: NextApiRequest): string | undefined {
  const cookies = parseCookie(req.headers.cookie);
  return cookies[AUTH_CONFIG.REFRESH_TOKEN_COOKIE];
}

export function buildAuthHeader(accessToken?: string): string | undefined {
  if (!accessToken) return undefined;
  return `${BEARER_PREFIX} ${accessToken}`;
}

export function setAuthCookies(res: NextApiResponse, tokens: Tokens): void {
  const secure = process.env.NODE_ENV === 'production';
  const baseOptions = {
    httpOnly: true,
    secure,
    sameSite: AUTH_CONFIG.COOKIE_SAME_SITE,
    path: AUTH_CONFIG.COOKIE_PATH,
  } as const;

  const accessTokenCookie = serializeCookie(
    AUTH_CONFIG.ACCESS_TOKEN_COOKIE,
    tokens.accessToken.token,
    baseOptions,
  );
  const refreshTokenCookie = serializeCookie(
    AUTH_CONFIG.REFRESH_TOKEN_COOKIE,
    tokens.refreshToken.token,
    baseOptions,
  );

  res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
}

// http-only 쿠키는 클라이언트에서 삭제할 수 없기 때문에 proxy에서 만료
export function clearAuthCookies(res: NextApiResponse): void {
  const secure = process.env.NODE_ENV === 'production';
  const baseOptions = {
    httpOnly: true,
    secure,
    sameSite: AUTH_CONFIG.COOKIE_SAME_SITE,
    path: AUTH_CONFIG.COOKIE_PATH,
    maxAge: 0,
  } as const;

  const accessTokenCookie = serializeCookie(AUTH_CONFIG.ACCESS_TOKEN_COOKIE, '', baseOptions);
  const refreshTokenCookie = serializeCookie(AUTH_CONFIG.REFRESH_TOKEN_COOKIE, '', baseOptions);

  res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
}

export async function refreshTokens(baseUrl: string, refreshToken: string): Promise<Tokens | null> {
  const refreshUrl = `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}${REAL_API_PREFIX}${AUTH_CONFIG.REFRESH_ENDPOINT}`;
  const init: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': JSON_CONTENT_TYPE,
    },
    body: JSON.stringify({ refreshToken }),
  };

  const response = await fetch(refreshUrl, init);

  if (response.status !== HTTP_STATUS.OK) return null;

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes(JSON_CONTENT_TYPE)) return null;

  const json = (await response.json()) as RefreshResponse;

  if (!json?.data?.tokens) return null;

  return json.data.tokens;
}
