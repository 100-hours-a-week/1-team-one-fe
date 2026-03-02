import type { NextApiRequest, NextApiResponse } from 'next';

import { AUTH_CONFIG } from '@/src/shared/config/auth';
import { HTTP_STATUS } from '@/src/shared/config/http-status';
import {
  buildQueryString,
  getPathSegments,
  joinUrl,
  shouldSkipAuth,
} from '@/src/shared/lib/bff/path';
import { forwardRequest, respondWithPayload } from '@/src/shared/lib/bff/proxy';
import { maybeRevalidatePost } from '@/src/shared/lib/bff/revalidate';
import {
  clearAuthCookies,
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies,
  refreshTokens,
  setAuthCookies,
} from '@/src/shared/lib/bff/token';

const MOMENTS_PREFIX = 'moments';
const REAL_API_PREFIX = '/api';
const NO_META_DATA_RESPONSE = { code: 'NO_META_DATA', data: null } as const;
const SHOULD_LOG_PROXY = process.env.NODE_ENV !== 'production';

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
  console.log('[BFF HIT]', req.url, req.query);

  const pathSegments = getPathSegments(req.query.path);

  if (pathSegments.length === 0) {
    logProxyNotFound('bff', req, { reason: 'missing_path' });
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

  const isMomentsPath = pathSegments[0] === MOMENTS_PREFIX;
  const targetSegments = isMomentsPath ? pathSegments.slice(1) : pathSegments;
  const targetPath = [REAL_API_PREFIX, ...targetSegments].join('/');
  const isLogoutPath = targetPath.replace(/^\/api/, '') === AUTH_CONFIG.LOGOUT_ENDPOINT;
  const queryString = buildQueryString(req.query);
  const targetUrl = joinUrl(baseUrl, `${targetPath}${queryString}`);

  const accessToken = getAccessTokenFromCookies(req);
  const refreshToken = getRefreshTokenFromCookies(req);

  const skipAuth = shouldSkipAuth(targetPath);
  const initialResponse = await forwardRequest(targetUrl, req, accessToken, skipAuth);

  if (initialResponse.status === HTTP_STATUS.NOT_FOUND) {
    logProxyNotFound('real', req, { targetUrl, attempt: 'initial' });
  }
  console.log('initialResponse', initialResponse);
  console.log('targetUrl', targetUrl);
  console.log('req', req.headers);

  if (initialResponse.status !== HTTP_STATUS.UNAUTHORIZED || !refreshToken) {
    if (isMomentsPath && initialResponse.status === HTTP_STATUS.UNAUTHORIZED) {
      res.status(HTTP_STATUS.OK).json(NO_META_DATA_RESPONSE);
      return;
    }
    if (isLogoutPath && initialResponse.status === HTTP_STATUS.OK) {
      clearAuthCookies(res);
    }
    await maybeRevalidatePost(res, req.method, targetPath, initialResponse.status);
    respondWithPayload(res, initialResponse.status, initialResponse.json);
    return;
  }

  if (skipAuth || !refreshToken) {
    respondWithPayload(res, initialResponse.status, initialResponse.json);
    return;
  }

  const refreshedTokens = await refreshTokens(baseUrl, refreshToken);

  if (!refreshedTokens) {
    if (isMomentsPath) {
      res.status(HTTP_STATUS.OK).json(NO_META_DATA_RESPONSE);
      return;
    }
    respondWithPayload(res, initialResponse.status, initialResponse.json);
    return;
  }

  setAuthCookies(res, refreshedTokens);

  const retryResponse = await forwardRequest(
    targetUrl,
    req,
    refreshedTokens.accessToken.token,
    skipAuth,
  );

  if (retryResponse.status === HTTP_STATUS.NOT_FOUND) {
    logProxyNotFound('real', req, { targetUrl, attempt: 'retry' });
  }

  if (isLogoutPath && retryResponse.status === HTTP_STATUS.OK) {
    clearAuthCookies(res);
  }

  await maybeRevalidatePost(res, req.method, targetPath, retryResponse.status);
  respondWithPayload(res, retryResponse.status, retryResponse.json);
}
