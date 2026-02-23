import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import {
  fetchValidStretchingSessionsFn,
  type ValidStretchingSessionItemType,
} from '@/src/entities/stretching-session';
import { type ApiError } from '@/src/shared/api';

import { STRETCHING_SESSION_QUERY_KEYS } from '../config/query-keys';

export type ValidStretchingSessionsQueryKey = ReturnType<
  typeof STRETCHING_SESSION_QUERY_KEYS.valid
>;

type ValidStretchingSessionsResult = ReadonlyArray<ValidStretchingSessionItemType> | null;

export type ValidStretchingSessionsQueryOptionsType = Omit<
  UseQueryOptions<
    ValidStretchingSessionsResult,
    ApiError,
    ValidStretchingSessionsResult,
    ValidStretchingSessionsQueryKey
  >,
  'queryKey' | 'queryFn'
>;

export function useValidStretchingSessionsQuery(options?: ValidStretchingSessionsQueryOptionsType) {
  return useQuery({
    queryKey: STRETCHING_SESSION_QUERY_KEYS.valid(),
    queryFn: fetchValidStretchingSessionsFn,
    ...options,
  });
}
