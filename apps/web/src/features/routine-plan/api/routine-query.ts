import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type ApiError } from '@/src/shared/api';

import { routinePlanQueryOptions, type RoutineQueryKey } from './query-options';
import type { RoutineData } from './types';

export type RoutineQueryOptions = Omit<
  UseQueryOptions<RoutineData, ApiError, RoutineData, RoutineQueryKey>,
  'queryKey' | 'queryFn'
>;

export function useRoutineQuery(options: RoutineQueryOptions = {}) {
  return useQuery({
    ...routinePlanQueryOptions(),
    ...options,
  });
}
