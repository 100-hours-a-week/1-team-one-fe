import type { NextApiRequest } from 'next';

import { AUTH_CONFIG } from '@/src/shared/config/auth';

const NO_AUTH_PATHS = new Set<string>([AUTH_CONFIG.LOGIN_ENDPOINT, AUTH_CONFIG.REFRESH_ENDPOINT]);

export function getPathSegments(pathParam: string | string[] | undefined): string[] {
  if (typeof pathParam === 'string') {
    return [pathParam];
  }

  if (Array.isArray(pathParam)) {
    return pathParam;
  }

  return [];
}

export function buildQueryString(query: NextApiRequest['query']): string {
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

export function joinUrl(base: string, path: string): string {
  if (!base) {
    return path;
  }

  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${normalizedBase}${normalizedPath}`;
}

export function shouldSkipAuth(targetPath: string): boolean {
  const apiPath = targetPath.replace(/^\/api/, '');
  return NO_AUTH_PATHS.has(apiPath);
}
