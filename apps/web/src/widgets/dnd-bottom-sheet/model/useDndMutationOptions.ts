import { useQueryClient } from '@tanstack/react-query';
import { isAfter, isValid, parseISO } from 'date-fns';
import { useCallback } from 'react';

import type { DndStatusType, DndUpdateDataType, DndUpdateRequestDTO } from '@/src/entities/dnd';
import { DND_QUERY_KEYS } from '@/src/features/dnd';
import type { ApiError } from '@/src/shared/api';

type DndOptimisticContextType = {
  previousDndStatus?: DndStatusType;
};

function getDndOptimisticContext(value: unknown): DndOptimisticContextType | undefined {
  if (typeof value !== 'object' || value === null) {
    return undefined;
  }
  if (!('previousDndStatus' in value)) {
    return undefined;
  }
  return value as DndOptimisticContextType;
}

export function useDndMutationOptions() {
  const queryClient = useQueryClient();

  const handleMutate = useCallback(
    async (variables: DndUpdateRequestDTO): Promise<DndOptimisticContextType> => {
      await queryClient.cancelQueries({ queryKey: DND_QUERY_KEYS.detail() });

      const previousDndStatus = queryClient.getQueryData<DndStatusType>(DND_QUERY_KEYS.detail());

      queryClient.setQueryData<DndStatusType | undefined>(DND_QUERY_KEYS.detail(), (prev) => {
        if (!prev) return prev;

        const parsed = parseISO(variables.dndFinishedAt);
        if (!isValid(parsed)) {
          return {
            ...prev,
            dndFinishedAt: variables.dndFinishedAt,
          };
        }

        const isActive = isAfter(parsed, new Date());
        return {
          ...prev,
          dnd: isActive,
          dndFinishedAt: variables.dndFinishedAt,
        };
      });

      return { previousDndStatus };
    },
    [queryClient],
  );

  const handleError = useCallback(
    (
      _error: ApiError,
      _variables: DndUpdateRequestDTO,
      onMutateResult: unknown,
      _context?: unknown,
    ) => {
      const context = getDndOptimisticContext(onMutateResult);
      if (!context?.previousDndStatus) return;
      queryClient.setQueryData(DND_QUERY_KEYS.detail(), context.previousDndStatus);
    },
    [queryClient],
  );

  const handleSuccess = useCallback(
    (data: DndUpdateDataType | undefined, variables: DndUpdateRequestDTO) => {
      queryClient.setQueryData<DndStatusType | undefined>(DND_QUERY_KEYS.detail(), (prev) => {
        if (!prev) return prev;

        const finishedAt = data?.dndFinishedAt ?? variables.dndFinishedAt;
        if (!finishedAt) {
          return prev;
        }

        const parsed = parseISO(finishedAt);
        if (!isValid(parsed)) {
          return {
            ...prev,
            dndFinishedAt: finishedAt,
          };
        }

        const isActive = isAfter(parsed, new Date());
        return {
          ...prev,
          dnd: isActive,
          dndFinishedAt: finishedAt,
        };
      });
    },
    [queryClient],
  );

  const handleSettled = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: DND_QUERY_KEYS.detail() });
  }, [queryClient]);

  return {
    onMutate: handleMutate,
    onError: handleError,
    onSuccess: handleSuccess,
    onSettled: handleSettled,
  };
}
