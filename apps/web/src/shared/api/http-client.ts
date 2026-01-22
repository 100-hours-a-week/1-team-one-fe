import axios, { type AxiosInstance } from 'axios';

import { API_CONFIG } from '@/src/shared/config/api';

import { toApiError } from './api-error';
import { logApiError } from './api-logger';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
} as const;

function createClient(baseURL: string, useBasePrefix: boolean): AxiosInstance {
  const basePrefix = useBasePrefix ? (process.env.NEXT_PUBLIC_API_BASE_URL ?? '') : '';
  const client = axios.create({
    baseURL: basePrefix ? `${basePrefix}${baseURL}` : baseURL,
    timeout: API_CONFIG.DEFAULT_TIMEOUT,
    headers: DEFAULT_HEADERS,
    withCredentials: true,
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error)) {
        const apiError = toApiError(error);
        logApiError(apiError);
        return Promise.reject(apiError);
      }

      return Promise.reject(error);
    },
  );

  return client;
}

export const realClient = createClient(API_CONFIG.REAL_BASE_URL, true);
export const bffClient = createClient(API_CONFIG.BFF_BASE_URL, false);

export interface ClientOptions {
  requiresAuth?: boolean;
}

export function getHttpClient(options?: ClientOptions): AxiosInstance {
  const requiresAuth = options?.requiresAuth ?? false;

  if (requiresAuth) {
    return bffClient;
  }

  return realClient;
}
