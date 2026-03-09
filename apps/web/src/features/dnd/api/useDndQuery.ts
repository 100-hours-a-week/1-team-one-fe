import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import {
  type DndStatusQueryKey,
  dndStatusQueryOptions,
  type DndStatusType,
} from '@/src/entities/dnd';
import { type ApiError } from '@/src/shared/api';

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
