import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type ApiError, getHttpClient } from '@/src/shared/api';

import { ROUTINE_PLAN_QUERY_KEYS } from '../config/query-keys';
import type { RoutineData, RoutineResponse } from './types';

async function fetchRoutine(): Promise<RoutineData> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<RoutineResponse>('/users/me/routines');
  return response.data.data;
}

export type RoutineQueryOptions = Omit<
  UseQueryOptions<
    RoutineData,
    ApiError,
    RoutineData,
    ReturnType<typeof ROUTINE_PLAN_QUERY_KEYS.routine>
  >,
  'queryKey' | 'queryFn'
>;

export function useRoutineQuery(options: RoutineQueryOptions = {}) {
  return useQuery({
    queryKey: ROUTINE_PLAN_QUERY_KEYS.routine(),
    queryFn: fetchRoutine,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    ...options,
  });
}
