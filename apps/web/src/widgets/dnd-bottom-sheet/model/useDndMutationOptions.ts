import { useQueryClient } from '@tanstack/react-query';
import { isAfter, isValid, parseISO } from 'date-fns';
import { useCallback } from 'react';

import type { AlarmSettingsType } from '@/src/entities/alarm-settings';
import type { DndUpdateDataType, DndUpdateRequestDTO } from '@/src/entities/dnd';
import { ALARM_SETTINGS_QUERY_KEYS } from '@/src/features/alarm-settings';
import type { ApiError } from '@/src/shared/api';

type DndOptimisticContextType = {
  previousAlarmSettings?: AlarmSettingsType;
};

function getDndOptimisticContext(value: unknown): DndOptimisticContextType | undefined {
  if (typeof value !== 'object' || value === null) {
    return undefined;
  }
  if (!('previousAlarmSettings' in value)) {
    return undefined;
  }
  return value as DndOptimisticContextType;
}

export function useDndMutationOptions() {
  const queryClient = useQueryClient();

  const handleMutate = useCallback(
    async (variables: DndUpdateRequestDTO): Promise<DndOptimisticContextType> => {
      await queryClient.cancelQueries({ queryKey: ALARM_SETTINGS_QUERY_KEYS.detail() });

      const previousAlarmSettings = queryClient.getQueryData<AlarmSettingsType>(
        ALARM_SETTINGS_QUERY_KEYS.detail(),
      );

      queryClient.setQueryData<AlarmSettingsType | undefined>(
        ALARM_SETTINGS_QUERY_KEYS.detail(),
        (prev) => {
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
        },
      );

      return { previousAlarmSettings };
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
      if (!context?.previousAlarmSettings) return;
      queryClient.setQueryData(ALARM_SETTINGS_QUERY_KEYS.detail(), context.previousAlarmSettings);
    },
    [queryClient],
  );

  const handleSuccess = useCallback(
    (data: DndUpdateDataType | undefined, variables: DndUpdateRequestDTO) => {
      queryClient.setQueryData<AlarmSettingsType | undefined>(
        ALARM_SETTINGS_QUERY_KEYS.detail(),
        (prev) => {
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
        },
      );
    },
    [queryClient],
  );

  const handleSettled = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ALARM_SETTINGS_QUERY_KEYS.detail() });
  }, [queryClient]);

  return {
    onMutate: handleMutate,
    onError: handleError,
    onSuccess: handleSuccess,
    onSettled: handleSettled,
  };
}
