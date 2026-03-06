import { queryOptions } from '@tanstack/react-query';

import {
  fetchStretchingSessionFn,
  fetchValidStretchingSessionsFn,
  type StretchingSessionType,
  type ValidStretchingSessionItemType,
} from '@/src/entities/stretching-session';
import { type ApiError } from '@/src/shared/api';

import { STRETCHING_SESSION_QUERY_KEYS } from '../config/query-keys';

export type StretchingSessionQueryKey = ReturnType<typeof STRETCHING_SESSION_QUERY_KEYS.detail>;

export function stretchingSessionQueryOptions(sessionId: string) {
  return queryOptions<
    StretchingSessionType,
    ApiError,
    StretchingSessionType,
    StretchingSessionQueryKey
  >({
    queryKey: STRETCHING_SESSION_QUERY_KEYS.detail(sessionId),
    queryFn: () => fetchStretchingSessionFn(sessionId),
  });
}

export type ValidStretchingSessionsQueryKey = ReturnType<
  typeof STRETCHING_SESSION_QUERY_KEYS.valid
>;

type ValidStretchingSessionsResult = ReadonlyArray<ValidStretchingSessionItemType> | null;

export function validStretchingSessionsQueryOptions() {
  return queryOptions<
    ValidStretchingSessionsResult,
    ApiError,
    ValidStretchingSessionsResult,
    ValidStretchingSessionsQueryKey
  >({
    queryKey: STRETCHING_SESSION_QUERY_KEYS.valid(),
    queryFn: fetchValidStretchingSessionsFn,
  });
}
