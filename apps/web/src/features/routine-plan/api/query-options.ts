import { queryOptions } from '@tanstack/react-query';

import { type ApiError, getHttpClient } from '@/src/shared/api';

import { ROUTINE_PLAN_CONFIG } from '../config/constants';
import { ROUTINE_PLAN_QUERY_KEYS } from '../config/query-keys';
import { isRoutineGenerating } from '../model/is-routine-generating';
import type { RoutineData, RoutineResponse } from './types';

async function fetchRoutine(): Promise<RoutineData> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<RoutineResponse>('/users/me/routines');
  return response.data.data;
}

export type RoutineQueryKey = ReturnType<typeof ROUTINE_PLAN_QUERY_KEYS.routine>;

export function routinePlanQueryOptions() {
  return queryOptions<RoutineData, ApiError, RoutineData, RoutineQueryKey>({
    queryKey: ROUTINE_PLAN_QUERY_KEYS.routine(),
    queryFn: fetchRoutine,
    refetchOnWindowFocus: false,
    refetchInterval: (query) => {
      if (!isRoutineGenerating(query.state.data)) {
        return false;
      }

      return ROUTINE_PLAN_CONFIG.POLLING_INTERVAL_MS;
    },
    refetchIntervalInBackground: true,
  });
}
