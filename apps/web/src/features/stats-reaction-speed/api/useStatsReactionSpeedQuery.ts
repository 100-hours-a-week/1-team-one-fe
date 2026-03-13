import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import {
  type StatsReactionSpeedDataType,
  type StatsReactionSpeedQueryKey,
  statsReactionSpeedQueryOptions,
  type StatsReactionSpeedQueryParamsType,
} from '@/src/entities/stats';
import { type ApiError } from '@/src/shared/api';

export type StatsReactionSpeedQueryOptions = Omit<
  UseQueryOptions<
    StatsReactionSpeedDataType,
    ApiError,
    StatsReactionSpeedDataType,
    StatsReactionSpeedQueryKey
  >,
  'queryKey' | 'queryFn'
>;

export function useStatsReactionSpeedQuery(
  params: StatsReactionSpeedQueryParamsType,
  options?: StatsReactionSpeedQueryOptions,
) {
  return useQuery({
    ...statsReactionSpeedQueryOptions(params),
    ...options,
  });
}
