import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type ExerciseSessionReportDetailType } from '@/src/entities/exercise-session-report';
import { type ApiError } from '@/src/shared/api';

import {
  type ExerciseSessionReportDetailQueryKey,
  exerciseSessionReportDetailQueryOptions,
} from './query-options';

export type ExerciseSessionReportDetailQueryOptions = Omit<
  UseQueryOptions<
    ExerciseSessionReportDetailType,
    ApiError,
    ExerciseSessionReportDetailType,
    ExerciseSessionReportDetailQueryKey
  >,
  'queryKey' | 'queryFn'
>;

export function useExerciseSessionReportDetailQuery(
  reportId: number,
  options?: ExerciseSessionReportDetailQueryOptions,
) {
  return useQuery({
    ...exerciseSessionReportDetailQueryOptions(reportId),
    ...options,
  });
}
