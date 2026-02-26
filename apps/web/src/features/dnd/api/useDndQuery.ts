import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type DndStatusType, fetchDndStatusFn } from '@/src/entities/dnd';
import { type ApiError } from '@/src/shared/api';

import { DND_QUERY_KEYS } from '../config/query-keys';

type DndQueryOptionsType = Omit<UseQueryOptions<DndStatusType, ApiError>, 'queryKey' | 'queryFn'>;

export function useDndQuery(options?: DndQueryOptionsType) {
  return useQuery({
    queryKey: DND_QUERY_KEYS.detail(),
    queryFn: fetchDndStatusFn,
    throwOnError: false,
    retry: false,
    ...options,
  });
}
