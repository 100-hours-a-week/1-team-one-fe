import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import {
  type AlarmSettingsDataType,
  type AlarmSettingsRequestDTO,
  submitAlarmSettingsFn,
} from '@/src/entities/alarm-settings';
import { type ApiError } from '@/src/shared/api';

import { ALARM_SETTINGS_QUERY_KEYS } from '../config/query-keys';

type AlarmSettingsMutationOptionsType = Omit<
  UseMutationOptions<AlarmSettingsDataType, ApiError, AlarmSettingsRequestDTO>,
  'mutationFn'
>;

export function useAlarmSettingsMutation(options?: AlarmSettingsMutationOptionsType) {
  return useMutation({
    mutationKey: ALARM_SETTINGS_QUERY_KEYS.update(),
    mutationFn: submitAlarmSettingsFn,
    ...options,
  });
}
