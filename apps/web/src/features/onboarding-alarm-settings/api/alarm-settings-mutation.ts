import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { type ApiError, getHttpClient } from '@/src/shared/api';

import { ALARM_SETTINGS_QUERY_KEYS } from '../config/query-keys';
import type { AlarmSettingsData, AlarmSettingsRequest, AlarmSettingsResponse } from './types';

async function submitAlarmSettings(values: AlarmSettingsRequest): Promise<AlarmSettingsData> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.put<AlarmSettingsResponse>('/users/me/alarm-settings', values);

  return response.data.data;
}

export type AlarmSettingsMutationOptions = Omit<
  UseMutationOptions<AlarmSettingsData, ApiError, AlarmSettingsRequest>,
  'mutationFn'
>;

export function useAlarmSettingsMutation(options?: AlarmSettingsMutationOptions) {
  return useMutation({
    mutationKey: ALARM_SETTINGS_QUERY_KEYS.update(),
    mutationFn: submitAlarmSettings,
    ...options,
  });
}
