import type { NextApiRequest, NextApiResponse } from 'next';

import type { ApiResponse } from '@/src/shared/api';
import { AUTH_CONFIG } from '@/src/shared/config/auth';
import { HTTP_STATUS } from '@/src/shared/config/http-status';
import { parseCookie } from '@/src/shared/lib/cookie/parse-cookie';
import { serializeCookie } from '@/src/shared/lib/cookie/serialize-cookie';

const JSON_CONTENT_TYPE = 'application/json';
const BEARER_PREFIX = 'Bearer';
const BFF_PREFIX = 'bff';
const REAL_API_PREFIX = '/api';
const SHOULD_LOG_PROXY = process.env.NODE_ENV !== 'production';

interface Tokens {
  accessToken: { token: string; expiresAt: string };
  refreshToken: { token: string; expiresAt: string };
}

type RefreshResponse = ApiResponse<{ tokens: Tokens }>;

type ProxyResponse = ApiResponse<Record<string, unknown>>;

function getPathSegments(pathParam: string | string[] | undefined): string[] {
  if (typeof pathParam === 'string') {
    return [pathParam];
  }

  if (Array.isArray(pathParam)) {
    return pathParam;
  }

  return [];
}

function buildQueryString(query: NextApiRequest['query']): string {
  const entries = Object.entries(query).filter(([key]) => key !== 'path');

  if (entries.length === 0) {
    return '';
  }

  const params = new URLSearchParams();

  entries.forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
      return;
    }

    if (typeof value === 'string') {
      params.append(key, value);
    }
  });

  const queryString = params.toString();

  return queryString ? `?${queryString}` : '';
}

function joinUrl(base: string, path: string): string {
  if (!base) {
    return path;
  }

  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${normalizedBase}${normalizedPath}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * api 응답에서 accesstoken, refreshtoken 추출
 */
function extractTokens(payload: unknown): Tokens | null {
  if (!isRecord(payload)) {
    return null;
  }

  const data = payload.data;

  if (!isRecord(data)) {
    return null;
  }

  const tokens = data.tokens;

  if (!isRecord(tokens)) {
    return null;
  }

  const accessToken = tokens.accessToken;
  const refreshToken = tokens.refreshToken;

  if (!isRecord(accessToken) || !isRecord(refreshToken)) {
    return null;
  }

  const accessTokenString = accessToken.token;
  const refreshTokenString = refreshToken.token;

  if (typeof accessTokenString !== 'string' || typeof refreshTokenString !== 'string') {
    return null;
  }

  //TODO: expiresAt 도 검사에 추가 예정
  return {
    accessToken: { token: accessTokenString, expiresAt: '' },
    refreshToken: { token: refreshTokenString, expiresAt: '' },
  };
}

function stripTokens(payload: unknown): unknown {
  if (!isRecord(payload)) {
    return payload;
  }

  const data = payload.data;

  if (!isRecord(data)) {
    return payload;
  }

  if (!('tokens' in data)) {
    return payload;
  }

  const { tokens: _ignored, ...restData } = data;

  return {
    ...payload,
    data: restData,
  };
}

function getRequestBody(req: NextApiRequest): string | undefined {
  if (req.method === 'GET' || req.method === 'HEAD') {
    return undefined;
  }

  if (typeof req.body === 'string') {
    return req.body;
  }

  if (req.body === undefined) {
    return undefined;
  }

  return JSON.stringify(req.body);
}

function getAccessTokenFromCookies(req: NextApiRequest): string | undefined {
  const cookies = parseCookie(req.headers.cookie);

  return cookies[AUTH_CONFIG.ACCESS_TOKEN_COOKIE];
}

function getRefreshTokenFromCookies(req: NextApiRequest): string | undefined {
  const cookies = parseCookie(req.headers.cookie);

  return cookies[AUTH_CONFIG.REFRESH_TOKEN_COOKIE];
}

function buildAuthHeader(accessToken?: string): string | undefined {
  if (!accessToken) {
    return undefined;
  }

  return `${BEARER_PREFIX} ${accessToken}`;
}

function setAuthCookies(res: NextApiResponse, tokens: Tokens): void {
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

async function requestJson<TResponse>(
  url: string,
  init: RequestInit,
): Promise<{ status: number; json: TResponse | null; headers: Headers }> {
  const response = await fetch(url, init);

  if (response.status === HTTP_STATUS.NOT_FOUND) {
    return { status: response.status, json: null, headers: response.headers };
  }

  const contentType = response.headers.get('content-type') ?? '';
  const hasJson = contentType.includes(JSON_CONTENT_TYPE);

  if (!hasJson) {
    return { status: response.status, json: null, headers: response.headers };
  }

  const json = (await response.json()) as TResponse;

  return { status: response.status, json, headers: response.headers };
}

async function refreshTokens(baseUrl: string, refreshToken: string): Promise<Tokens | null> {
  const refreshUrl = joinUrl(baseUrl, `${REAL_API_PREFIX}${AUTH_CONFIG.REFRESH_ENDPOINT}`);
  const init: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': JSON_CONTENT_TYPE,
    },
    body: JSON.stringify({ refreshToken }),
  };

  const { status, json } = await requestJson<RefreshResponse>(refreshUrl, init);

  if (status !== 200 || !json?.data?.tokens) {
    return null;
  }

  return json.data.tokens;
}

async function forwardRequest(
  targetUrl: string,
  req: NextApiRequest,
  accessToken?: string,
): Promise<{ status: number; json: ProxyResponse | null; headers: Headers }> {
  const body = getRequestBody(req);
  const authorization = buildAuthHeader(accessToken);
  const headers: Record<string, string> = {};

  const contentType = Array.isArray(req.headers['content-type'])
    ? req.headers['content-type'][0]
    : req.headers['content-type'];
  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  const accept = Array.isArray(req.headers.accept) ? req.headers.accept[0] : req.headers.accept;
  if (accept) {
    headers.Accept = accept;
  }

  if (authorization) {
    headers.Authorization = authorization;
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    body,
  };

  return requestJson<ProxyResponse>(targetUrl, init);
}

/**
 * token 있으면 set-cookie 후 응답에서 token 지우고 응답하는 방식
 */
function respondWithPayload(res: NextApiResponse, status: number, payload: ProxyResponse | null) {
  if (!payload) {
    res.status(status).end();
    return;
  }

  const tokens = extractTokens(payload);
  if (tokens) {
    setAuthCookies(res, tokens);
  }

  const sanitizedPayload = stripTokens(payload);
  res.status(status).json(sanitizedPayload);
}

function logProxyNotFound(
  source: 'bff' | 'real',
  req: NextApiRequest,
  detail?: Readonly<Record<string, unknown>>,
): void {
  if (!SHOULD_LOG_PROXY) return;
   
  console.info('[bff-proxy] not_found', {
    source,
    method: req.method,
    path: req.url,
    ...detail,
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pathSegments = getPathSegments(req.query.path);

  if (pathSegments.length === 0) {
    logProxyNotFound('bff', req, { reason: 'missing_path' });
    res.status(HTTP_STATUS.NOT_FOUND).end();
    return;
  }

  if (pathSegments[0] !== BFF_PREFIX) {
    logProxyNotFound('bff', req, { reason: 'invalid_prefix' });
    res.status(HTTP_STATUS.NOT_FOUND).end();
    return;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

  if (!baseUrl) {
    logProxyNotFound('bff', req, { reason: 'missing_base_url' });
    res.status(HTTP_STATUS.SERVER_ERROR_MIN).json({
      code: 'INTERNAL_ERROR',
      errors: [{ reason: 'missing api base url' }],
    });
    return;
  }

  const targetPath = [REAL_API_PREFIX, ...pathSegments.slice(1)].join('/');
  const queryString = buildQueryString(req.query);
  const targetUrl = joinUrl(baseUrl, `${targetPath}${queryString}`);

  const accessToken = getAccessTokenFromCookies(req);
  const refreshToken = getRefreshTokenFromCookies(req);

  const initialResponse = await forwardRequest(targetUrl, req, accessToken);

  if (initialResponse.status === HTTP_STATUS.NOT_FOUND) {
    logProxyNotFound('real', req, { targetUrl, attempt: 'initial' });
  }

  if (initialResponse.status !== HTTP_STATUS.UNAUTHORIZED || !refreshToken) {
    respondWithPayload(res, initialResponse.status, initialResponse.json);
    return;
  }

  const refreshedTokens = await refreshTokens(baseUrl, refreshToken);

  if (!refreshedTokens) {
    respondWithPayload(res, initialResponse.status, initialResponse.json);
    return;
  }

  setAuthCookies(res, refreshedTokens);

  const retryResponse = await forwardRequest(targetUrl, req, refreshedTokens.accessToken.token);

  if (retryResponse.status === HTTP_STATUS.NOT_FOUND) {
    logProxyNotFound('real', req, { targetUrl, attempt: 'retry' });
  }

  respondWithPayload(res, retryResponse.status, retryResponse.json);
}
