import type { NextApiRequest, NextApiResponse } from 'next';

import { HTTP_STATUS } from '@/src/shared/config/http-status';

import { buildAuthHeader, extractTokens, setAuthCookies, stripTokens } from './token';
import type { ProxyResponse } from './types';

const JSON_CONTENT_TYPE = 'application/json';

export function getRequestBody(req: NextApiRequest): string | undefined {
  if (req.method === 'GET' || req.method === 'HEAD') return undefined;

  if (typeof req.body === 'string') return req.body;

  if (req.body === undefined) return undefined;

  return JSON.stringify(req.body);
}

export async function requestJson<TResponse>(
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

export async function forwardRequest(
  targetUrl: string,
  req: NextApiRequest,
  accessToken?: string,
  skipAuth = false,
): Promise<{ status: number; json: ProxyResponse | null; headers: Headers }> {
  const body = getRequestBody(req);
  const authorization = skipAuth ? undefined : buildAuthHeader(accessToken);
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
export function respondWithPayload(
  res: NextApiResponse,
  status: number,
  payload: ProxyResponse | null,
): void {
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
