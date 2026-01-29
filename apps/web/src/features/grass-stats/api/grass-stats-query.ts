import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type ApiError, getHttpClient } from '@/src/shared/api';

import { GRASS_STATS_QUERY_KEYS } from '../config/query-keys';
import type { GrassStatsData, GrassStatsQueryParams, GrassStatsResponse } from './types';

async function fetchGrassStats(params: GrassStatsQueryParams): Promise<GrassStatsData> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<GrassStatsResponse>('/me/stats/grass', {
    params,
  });

  return response.data.data;
}

export type GrassStatsQueryKey =
  | ReturnType<typeof GRASS_STATS_QUERY_KEYS.weekly>
  | ReturnType<typeof GRASS_STATS_QUERY_KEYS.monthly>;

export type GrassStatsQueryOptions = Omit<
  UseQueryOptions<GrassStatsData, ApiError, GrassStatsData, GrassStatsQueryKey>,
  'queryKey' | 'queryFn'
>;

export function useGrassStatsQuery(
  params: GrassStatsQueryParams,
  options?: GrassStatsQueryOptions,
) {
  return useQuery({
    queryKey:
      params.view === 'WEEKLY'
        ? GRASS_STATS_QUERY_KEYS.weekly()
        : GRASS_STATS_QUERY_KEYS.monthly(params.month!),
    queryFn: () => fetchGrassStats(params),
    ...options,
  });
}
