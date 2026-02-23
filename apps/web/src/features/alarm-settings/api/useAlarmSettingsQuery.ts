import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type AlarmSettingsType, fetchAlarmSettingsFn } from '@/src/entities/alarm-settings';
import { type ApiError } from '@/src/shared/api';

import { ALARM_SETTINGS_QUERY_KEYS } from '../config/query-keys';

type AlarmSettingsQueryOptionsType = Omit<
  UseQueryOptions<AlarmSettingsType, ApiError>,
  'queryKey' | 'queryFn'
>;

export function useAlarmSettingsQuery(options?: AlarmSettingsQueryOptionsType) {
  return useQuery({
    queryKey: ALARM_SETTINGS_QUERY_KEYS.detail(),
    queryFn: fetchAlarmSettingsFn,
    throwOnError: false,
    retry: false,
    ...options,
  });
}
