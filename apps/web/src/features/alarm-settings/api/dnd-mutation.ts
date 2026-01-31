import { useMutation, type UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { isAfter, isValid, parseISO } from 'date-fns';

import { type ApiError, getHttpClient } from '@/src/shared/api';

import { ALARM_SETTINGS_QUERY_KEYS } from '../config/query-keys';
import type { AlarmSettings, DndUpdateData, DndUpdateRequest, DndUpdateResponse } from './types';

// TODO: DND mutation 에러 토스트 정책을 정리하고 공통 정책과 정합성 맞추기
async function submitDnd(values: DndUpdateRequest): Promise<DndUpdateData> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.put<DndUpdateResponse>('/users/me/alarm-settings/dnd', values);

  return response.data.data;
}

export type DndMutationOptions = Omit<
  UseMutationOptions<DndUpdateData, ApiError, DndUpdateRequest>,
  'mutationFn'
>;

export function useDndMutation(options?: DndMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ALARM_SETTINGS_QUERY_KEYS.dnd(),
    mutationFn: submitDnd,
    ...options,
    //여기서 onSuccess 정책이 복잡하여 hook 에서 처리하도록 함 ..
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.setQueryData<AlarmSettings | undefined>(
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
      void queryClient.invalidateQueries({ queryKey: ALARM_SETTINGS_QUERY_KEYS.detail() });

      if (options?.onSuccess) {
        options.onSuccess(data, variables, onMutateResult, context);
      }
    },
  });
}
