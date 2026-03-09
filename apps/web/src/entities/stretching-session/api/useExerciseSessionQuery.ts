import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type ApiError } from '@/src/shared/api';

import { STRETCHING_SESSION_QUERY_KEYS } from '../config/query-keys';
import type { StretchingSessionType } from '../model/types';
import { fetchStretchingSessionFn } from './stretching-session-get';
export type ExerciseSessionQueryKey = ReturnType<typeof STRETCHING_SESSION_QUERY_KEYS.detail>;

export type ExerciseSessionQueryOptions = Omit<
  UseQueryOptions<StretchingSessionType, ApiError, StretchingSessionType, ExerciseSessionQueryKey>,
  'queryKey' | 'queryFn'
>;

export function useExerciseSessionQuery(sessionId: string, options?: ExerciseSessionQueryOptions) {
  return useQuery({
    queryKey: STRETCHING_SESSION_QUERY_KEYS.detail(sessionId),
    queryFn: () => fetchStretchingSessionFn(sessionId),
    ...options,
  });
}
