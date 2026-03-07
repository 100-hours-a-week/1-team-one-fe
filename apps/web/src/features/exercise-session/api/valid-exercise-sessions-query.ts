import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type ApiError } from '@/src/shared/api';

import {
  type ValidExerciseSessionItem,
  type ValidExerciseSessionsQueryKey,
  validExerciseSessionsQueryOptions,
} from './query-options';

export type { ValidExerciseSessionItem, ValidExerciseSessionsQueryKey } from './query-options';

export type ValidExerciseSessionsQueryOptions = Omit<
  UseQueryOptions<
    ReadonlyArray<ValidExerciseSessionItem> | null,
    ApiError,
    ReadonlyArray<ValidExerciseSessionItem> | null,
    ValidExerciseSessionsQueryKey
  >,
  'queryKey' | 'queryFn'
>;

export function useValidExerciseSessionsQuery(options?: ValidExerciseSessionsQueryOptions) {
  return useQuery({
    ...validExerciseSessionsQueryOptions(),
    ...options,
  });
}
