import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import {
  type StatsSummaryDataType,
  type StatsSummaryQueryKey,
  statsSummaryQueryOptions,
} from '@/src/entities/stats';
import { type ApiError } from '@/src/shared/api';

export type StatsSummaryQueryOptions = Omit<
  UseQueryOptions<StatsSummaryDataType, ApiError, StatsSummaryDataType, StatsSummaryQueryKey>,
  'queryKey' | 'queryFn'
>;

export function useStatsSummaryQuery(options?: StatsSummaryQueryOptions) {
  return useQuery({
    ...statsSummaryQueryOptions(),
    ...options,
  });
}
