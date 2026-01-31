import { useMutation, type UseMutationOptions, useQueryClient } from '@tanstack/react-query';

import { type ApiError, getHttpClient } from '@/src/shared/api';

import { ALARM_SETTINGS_QUERY_KEYS } from '../config/query-keys';
import type { AlarmSettings, DndUpdateData, DndUpdateRequest, DndUpdateResponse } from './types';

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
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.setQueryData<AlarmSettings | undefined>(
        ALARM_SETTINGS_QUERY_KEYS.detail(),
        (prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            dnd: true,
            dndFinishedAt: data.dndFinishedAt,
          };
        },
      );

      if (options?.onSuccess) {
        options.onSuccess(data, variables, onMutateResult, context);
      }
    },
  });
}
