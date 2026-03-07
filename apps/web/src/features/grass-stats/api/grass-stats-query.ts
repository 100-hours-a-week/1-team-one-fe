import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type ApiError } from '@/src/shared/api';

import { type GrassStatsQueryKey, grassStatsQueryOptions } from './query-options';
import type { GrassStatsData, GrassStatsQueryParams } from './types';

export type GrassStatsQueryOptions = Omit<
  UseQueryOptions<GrassStatsData, ApiError, GrassStatsData, GrassStatsQueryKey>,
  'queryKey' | 'queryFn'
>;

export function useGrassStatsQuery(
  params: GrassStatsQueryParams,
  options?: GrassStatsQueryOptions,
) {
  return useQuery({
    ...grassStatsQueryOptions(params),
    ...options,
  });
}
