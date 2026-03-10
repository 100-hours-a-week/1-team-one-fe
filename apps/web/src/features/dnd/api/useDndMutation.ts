import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import {
  DND_QUERY_KEYS,
  type DndUpdateDataType,
  type DndUpdateRequestDTO,
  submitDndFn,
} from '@/src/entities/dnd';
import { type ApiError } from '@/src/shared/api';

export type DndMutationOptionsType = Omit<
  UseMutationOptions<DndUpdateDataType, ApiError, DndUpdateRequestDTO>,
  'mutationFn' | 'mutationKey'
>;

export function useDndMutation(options?: DndMutationOptionsType) {
  return useMutation({
    mutationKey: DND_QUERY_KEYS.dnd(),
    mutationFn: submitDndFn,
    ...options,
  });
}
