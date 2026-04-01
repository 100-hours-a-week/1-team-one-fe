import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import {
  type EmailAvailabilityDataType,
  type EmailAvailabilityQueryKey,
  emailAvailabilityQueryOptions,
} from '@/src/entities/signup';
import { type ApiError } from '@/src/shared/api';

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
    ...emailAvailabilityQueryOptions(email),
    enabled,
    ...options,
    meta: { ...options?.meta, disableToast: true },
  });
}
