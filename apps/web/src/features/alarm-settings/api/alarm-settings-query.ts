import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type ApiError, getHttpClient } from '@/src/shared/api';

import { ALARM_SETTINGS_QUERY_KEYS } from '../config/query-keys';
import type { AlarmSettings, AlarmSettingsResponse } from './types';

async function fetchAlarmSettings(): Promise<AlarmSettings> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<AlarmSettingsResponse>('/users/me/alarm-settings');

  return response.data.data.alarmSettings;
}

export type AlarmSettingsQueryOptions = Omit<
  UseQueryOptions<AlarmSettings, ApiError>,
  'queryKey' | 'queryFn'
>;

export function useAlarmSettingsQuery(options?: AlarmSettingsQueryOptions) {
  return useQuery({
    queryKey: ALARM_SETTINGS_QUERY_KEYS.detail(),
    queryFn: fetchAlarmSettings,
    throwOnError: false,
    retry: false,
    ...options,
  });
}
