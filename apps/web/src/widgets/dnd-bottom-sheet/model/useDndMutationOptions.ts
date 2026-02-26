import { useQueryClient } from '@tanstack/react-query';
import { isAfter, isValid, parseISO } from 'date-fns';

import type { DndStatusType, DndUpdateDataType, DndUpdateRequestDTO } from '@/src/entities/dnd';
import { DND_QUERY_KEYS } from '@/src/features/dnd';
import { createSingleOptimisticHandlers } from '@/src/shared/lib/react-query';

export function useDndMutationOptions() {
  const queryClient = useQueryClient();

  return createSingleOptimisticHandlers<DndStatusType, DndUpdateRequestDTO>({
    queryClient,
    queryKey: DND_QUERY_KEYS.detail(),
    updater: (prev, variables) => {
      if (!prev) return prev;

      const parsed = parseISO(variables.dndFinishedAt);
      if (!isValid(parsed)) {
        return { ...prev, dndFinishedAt: variables.dndFinishedAt };
      }

      const isActive = isAfter(parsed, new Date());
      return { ...prev, dnd: isActive, dndFinishedAt: variables.dndFinishedAt };
    },
    onSuccessCallback: (data, variables) => {
      const serverData = data as DndUpdateDataType | undefined;
      queryClient.setQueryData<DndStatusType | undefined>(DND_QUERY_KEYS.detail(), (prev) => {
        if (!prev) return prev;

        const finishedAt = serverData?.dndFinishedAt ?? variables.dndFinishedAt;
        if (!finishedAt) return prev;

        const parsed = parseISO(finishedAt);
        if (!isValid(parsed)) {
          return { ...prev, dndFinishedAt: finishedAt };
        }

        const isActive = isAfter(parsed, new Date());
        return { ...prev, dnd: isActive, dndFinishedAt: finishedAt };
      });
    },
  });
}
