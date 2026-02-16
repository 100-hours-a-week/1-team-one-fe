import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import {
  fetchStretchingSessionFn,
  type StretchingSessionType,
} from '@/src/entities/stretching-session';
import { type ApiError } from '@/src/shared/api';

import { STRETCHING_SESSION_QUERY_KEYS } from '../config/query-keys';

export type StretchingSessionQueryKey = ReturnType<typeof STRETCHING_SESSION_QUERY_KEYS.detail>;

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
    queryKey: STRETCHING_SESSION_QUERY_KEYS.detail(sessionId),
    queryFn: () => fetchStretchingSessionFn(sessionId),
    ...options,
  });
}
