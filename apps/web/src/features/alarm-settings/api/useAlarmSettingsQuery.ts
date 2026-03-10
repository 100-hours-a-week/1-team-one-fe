import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import {
  type AlarmSettingsQueryKey,
  alarmSettingsQueryOptions,
  type AlarmSettingsType,
} from '@/src/entities/alarm-settings';
import { type ApiError } from '@/src/shared/api';

type AlarmSettingsQueryOptionsType = Omit<
  UseQueryOptions<AlarmSettingsType, ApiError, AlarmSettingsType, AlarmSettingsQueryKey>,
  'queryKey' | 'queryFn'
>;

export function useAlarmSettingsQuery(options?: AlarmSettingsQueryOptionsType) {
  return useQuery({
    ...alarmSettingsQueryOptions(),
    ...options,
  });
}
