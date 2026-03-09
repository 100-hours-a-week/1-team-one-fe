import { queryOptions } from '@tanstack/react-query';

import {
  type ExerciseSessionReportDetailType,
  type ExerciseSessionReportListType,
  fetchExerciseSessionReportDetailFn,
  fetchExerciseSessionReportsFn,
} from '@/src/entities/exercise-session-report';
import { type ApiError } from '@/src/shared/api';

import { EXERCISE_SESSION_REPORT_QUERY_KEYS } from '../config/query-keys';

export type ExerciseSessionReportsQueryKey = ReturnType<
  typeof EXERCISE_SESSION_REPORT_QUERY_KEYS.list
>;
export type ExerciseSessionReportDetailQueryKey = ReturnType<
  typeof EXERCISE_SESSION_REPORT_QUERY_KEYS.detail
>;

export function exerciseSessionReportsQueryOptions() {
  return queryOptions<
    ExerciseSessionReportListType,
    ApiError,
    ExerciseSessionReportListType,
    ExerciseSessionReportsQueryKey
  >({
    queryKey: EXERCISE_SESSION_REPORT_QUERY_KEYS.list(),
    queryFn: fetchExerciseSessionReportsFn,
  });
}

export function exerciseSessionReportDetailQueryOptions(reportId: number) {
  return queryOptions<
    ExerciseSessionReportDetailType,
    ApiError,
    ExerciseSessionReportDetailType,
    ExerciseSessionReportDetailQueryKey
  >({
    queryKey: EXERCISE_SESSION_REPORT_QUERY_KEYS.detail(reportId),
    queryFn: () => fetchExerciseSessionReportDetailFn(reportId),
  });
}
