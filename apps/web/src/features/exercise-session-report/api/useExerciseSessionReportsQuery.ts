import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type ExerciseSessionReportListType } from '@/src/entities/exercise-session-report';
import { type ApiError } from '@/src/shared/api';

import {
  type ExerciseSessionReportsQueryKey,
  exerciseSessionReportsQueryOptions,
} from './query-options';

export type ExerciseSessionReportsQueryOptions = Omit<
  UseQueryOptions<
    ExerciseSessionReportListType,
    ApiError,
    ExerciseSessionReportListType,
    ExerciseSessionReportsQueryKey
  >,
  'queryKey' | 'queryFn'
>;

export function useExerciseSessionReportsQuery(options?: ExerciseSessionReportsQueryOptions) {
  return useQuery({
    ...exerciseSessionReportsQueryOptions(),
    ...options,
  });
}
