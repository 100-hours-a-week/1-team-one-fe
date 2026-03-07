import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type DndStatusType } from '@/src/entities/dnd';
import { type ApiError } from '@/src/shared/api';

import { type DndStatusQueryKey, dndStatusQueryOptions } from './query-options';

type DndQueryOptionsType = Omit<
  UseQueryOptions<DndStatusType, ApiError, DndStatusType, DndStatusQueryKey>,
  'queryKey' | 'queryFn'
>;

export function useDndQuery(options?: DndQueryOptionsType) {
  return useQuery({
    ...dndStatusQueryOptions(),
    ...options,
  });
}
