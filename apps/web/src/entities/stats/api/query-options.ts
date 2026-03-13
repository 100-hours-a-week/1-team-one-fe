import { queryOptions } from '@tanstack/react-query';

import type { ApiError } from '@/src/shared/api';

import { STATS_QUERY_KEYS } from '../config/query-keys';
import type {
  StatsReactionSpeedDataType,
  StatsReactionSpeedQueryParamsType,
  StatsSummaryDataType,
} from '../model/types';
import { fetchStatsReactionSpeedFn } from './stats-reaction-speed-get';
import { fetchStatsSummaryFn } from './stats-summary-get';

export type StatsSummaryQueryKey = ReturnType<typeof STATS_QUERY_KEYS.summary>;
export type StatsReactionSpeedQueryKey = ReturnType<typeof STATS_QUERY_KEYS.reactionSpeed>;

export function statsSummaryQueryOptions() {
  return queryOptions<StatsSummaryDataType, ApiError, StatsSummaryDataType, StatsSummaryQueryKey>({
    queryKey: STATS_QUERY_KEYS.summary(),
    queryFn: fetchStatsSummaryFn,
  });
}

export function statsReactionSpeedQueryOptions(params: StatsReactionSpeedQueryParamsType) {
  return queryOptions<
    StatsReactionSpeedDataType,
    ApiError,
    StatsReactionSpeedDataType,
    StatsReactionSpeedQueryKey
  >({
    queryKey: STATS_QUERY_KEYS.reactionSpeed(params.view),
    queryFn: () => fetchStatsReactionSpeedFn(params),
  });
}
