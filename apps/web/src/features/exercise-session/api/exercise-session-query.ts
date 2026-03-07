import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type StretchingSessionType } from '@/src/entities/stretching-session';
import { type ApiError } from '@/src/shared/api';

import { type ExerciseSessionQueryKey, exerciseSessionQueryOptions } from './query-options';

export type { ExerciseSessionQueryKey } from './query-options';

export type ExerciseSessionQueryOptions = Omit<
  UseQueryOptions<StretchingSessionType, ApiError, StretchingSessionType, ExerciseSessionQueryKey>,
  'queryKey' | 'queryFn'
>;

export function useExerciseSessionQuery(sessionId: string, options?: ExerciseSessionQueryOptions) {
  return useQuery({
    ...exerciseSessionQueryOptions(sessionId),
    ...options,
  });
}
