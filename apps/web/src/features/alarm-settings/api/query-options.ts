import { queryOptions } from '@tanstack/react-query';

import { type AlarmSettingsType, fetchAlarmSettingsFn } from '@/src/entities/alarm-settings';
import { type ApiError } from '@/src/shared/api';

import { ALARM_SETTINGS_QUERY_KEYS } from '../config/query-keys';

export type AlarmSettingsQueryKey = ReturnType<typeof ALARM_SETTINGS_QUERY_KEYS.detail>;

export function alarmSettingsQueryOptions() {
  return queryOptions<AlarmSettingsType, ApiError, AlarmSettingsType, AlarmSettingsQueryKey>({
    queryKey: ALARM_SETTINGS_QUERY_KEYS.detail(),
    queryFn: fetchAlarmSettingsFn,
    throwOnError: false,
    retry: false,
  });
}
