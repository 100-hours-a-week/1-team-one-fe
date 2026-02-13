import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type ExerciseSessionType, fetchExerciseSessionFn } from '@/src/entities/exercise-session';
import { type ApiError } from '@/src/shared/api';

import { EXERCISE_SESSION_QUERY_KEYS } from '../config/query-keys';

export type ExerciseSessionQueryKey = ReturnType<typeof EXERCISE_SESSION_QUERY_KEYS.detail>;

export type ExerciseSessionQueryOptionsType = Omit<
  UseQueryOptions<ExerciseSessionType, ApiError, ExerciseSessionType, ExerciseSessionQueryKey>,
  'queryKey' | 'queryFn'
>;

export function useExerciseSessionQuery(
  sessionId: string,
  options?: ExerciseSessionQueryOptionsType,
) {
  return useQuery({
    queryKey: EXERCISE_SESSION_QUERY_KEYS.detail(sessionId),
    queryFn: () => fetchExerciseSessionFn(sessionId),
    ...options,
  });
}
