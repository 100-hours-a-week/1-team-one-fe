import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type StretchingSessionType } from '@/src/entities/stretching-session';
import { type ApiError } from '@/src/shared/api';

import { type StretchingSessionQueryKey, stretchingSessionQueryOptions } from './query-options';

export type { StretchingSessionQueryKey } from './query-options';

export type StretchingSessionQueryOptionsType = Omit<
  UseQueryOptions<
    StretchingSessionType,
    ApiError,
    StretchingSessionType,
    StretchingSessionQueryKey
  >,
  'queryKey' | 'queryFn'
>;

export function useStretchingSessionQuery(
  sessionId: string,
  options?: StretchingSessionQueryOptionsType,
) {
  return useQuery({
    ...stretchingSessionQueryOptions(sessionId),
    ...options,
  });
}
