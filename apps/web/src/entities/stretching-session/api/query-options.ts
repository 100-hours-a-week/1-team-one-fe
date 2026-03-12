import { queryOptions } from '@tanstack/react-query';

import type { ApiError } from '@/src/shared/api';

import { STRETCHING_SESSION_QUERY_KEYS } from '../config/query-keys';
import type { StretchingSessionType } from '../model/types';
import type { ValidStretchingSessionItemType } from './dto/stretching-session.dto';
import { fetchStretchingSessionFn } from './stretching-session-get';
import { fetchValidStretchingSessionsFn } from './valid-stretching-sessions-get';

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
