import { queryOptions } from '@tanstack/react-query';

import type { ApiError } from '@/src/shared/api';

import { STATS_QUERY_KEYS } from '../config/query-keys';
import type { StatsSummaryDataType } from '../model/types';
import { fetchStatsSummaryFn } from './stats-summary-get';

export type StatsSummaryQueryKey = ReturnType<typeof STATS_QUERY_KEYS.summary>;

export function statsSummaryQueryOptions() {
  return queryOptions<StatsSummaryDataType, ApiError, StatsSummaryDataType, StatsSummaryQueryKey>({
    queryKey: STATS_QUERY_KEYS.summary(),
    queryFn: fetchStatsSummaryFn,
  });
}
