import { queryOptions } from '@tanstack/react-query';

import { type DndStatusType, fetchDndStatusFn } from '@/src/entities/dnd';
import { type ApiError } from '@/src/shared/api';

import { DND_QUERY_KEYS } from '../config/query-keys';

export type DndStatusQueryKey = ReturnType<typeof DND_QUERY_KEYS.detail>;

export function dndStatusQueryOptions() {
  return queryOptions<DndStatusType, ApiError, DndStatusType, DndStatusQueryKey>({
    queryKey: DND_QUERY_KEYS.detail(),
    queryFn: fetchDndStatusFn,
    throwOnError: false,
    retry: false,
  });
}
