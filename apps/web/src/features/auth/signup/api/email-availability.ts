import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type ApiError, getHttpClient } from '@/src/shared/api';

import { AUTH_QUERY_KEYS } from '../config/query-keys';
import type { EmailAvailabilityData, EmailAvailabilityResponse } from './types';

async function fetchEmailAvailability(email: string): Promise<EmailAvailabilityData> {
  const client = getHttpClient({ requiresAuth: false });
  //TODO: URL 상수화
  const response = await client.get<EmailAvailabilityResponse>('/auth/email-availability', {
    params: { email },
  });

  return response.data.data;
}

export type EmailAvailabilityQueryKey = ReturnType<typeof AUTH_QUERY_KEYS.emailAvailability>;

export type EmailAvailabilityQueryOptions = Omit<
  UseQueryOptions<
    EmailAvailabilityData,
    ApiError,
    EmailAvailabilityData,
    EmailAvailabilityQueryKey
  >,
  'queryKey' | 'queryFn'
>;

export function useEmailAvailabilityQuery(email: string, options?: EmailAvailabilityQueryOptions) {
  const hasEmail = Boolean(email);
  const enabled = hasEmail && (options?.enabled ?? true);

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.emailAvailability(email),
    queryFn: () => fetchEmailAvailability(email),
    enabled,
    ...options,
  });
}
