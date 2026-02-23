import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type EmailAvailabilityDataType, fetchEmailAvailabilityFn } from '@/src/entities/signup';
import { type ApiError } from '@/src/shared/api';

import { AUTH_QUERY_KEYS } from '../config/query-keys';

export type EmailAvailabilityQueryKey = ReturnType<typeof AUTH_QUERY_KEYS.emailAvailability>;

export type EmailAvailabilityQueryOptions = Omit<
  UseQueryOptions<
    EmailAvailabilityDataType,
    ApiError,
    EmailAvailabilityDataType,
    EmailAvailabilityQueryKey
  >,
  'queryKey' | 'queryFn'
>;

export function useEmailAvailabilityQuery(email: string, options?: EmailAvailabilityQueryOptions) {
  const hasEmail = Boolean(email);
  const enabled = hasEmail && (options?.enabled ?? true);

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.emailAvailability(email),
    queryFn: () => fetchEmailAvailabilityFn(email),
    enabled,
    ...options,
    meta: { ...options?.meta, disableToast: true },
  });
}
