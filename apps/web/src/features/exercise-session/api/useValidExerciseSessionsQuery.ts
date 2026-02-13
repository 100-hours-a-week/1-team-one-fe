import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import {
  fetchValidExerciseSessionsFn,
  type ValidExerciseSessionItemType,
} from '@/src/entities/exercise-session';
import { type ApiError } from '@/src/shared/api';

import { EXERCISE_SESSION_QUERY_KEYS } from '../config/query-keys';

export type ValidExerciseSessionsQueryKey = ReturnType<typeof EXERCISE_SESSION_QUERY_KEYS.valid>;

type ValidExerciseSessionsResult = ReadonlyArray<ValidExerciseSessionItemType> | null;

export type ValidExerciseSessionsQueryOptionsType = Omit<
  UseQueryOptions<
    ValidExerciseSessionsResult,
    ApiError,
    ValidExerciseSessionsResult,
    ValidExerciseSessionsQueryKey
  >,
  'queryKey' | 'queryFn'
>;

export function useValidExerciseSessionsQuery(options?: ValidExerciseSessionsQueryOptionsType) {
  return useQuery({
    queryKey: EXERCISE_SESSION_QUERY_KEYS.valid(),
    queryFn: fetchValidExerciseSessionsFn,
    ...options,
  });
}
