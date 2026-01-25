import type { AlarmSettingsRequest } from '../api/types';
import type { AlarmSettingsValues } from './alarm-settings-schema';

function normalizeTimeWithSeconds(value: string): string {
  if (/^\d{2}:\d{2}:\d{2}$/.test(value)) {
    return value;
  }
  if (/^\d{2}:\d{2}$/.test(value)) {
    return `${value}:00`;
  }
  return value;
}

export function toAlarmSettingsRequest(values: AlarmSettingsValues): AlarmSettingsRequest {
  return {
    interval: values.intervalMinutes,
    activeStartAt: normalizeTimeWithSeconds(values.activeStart),
    activeEndAt: normalizeTimeWithSeconds(values.activeEnd),
    focusStartAt: normalizeTimeWithSeconds(values.focusStart),
    focusEndAt: normalizeTimeWithSeconds(values.focusEnd),
    repeatDays: values.weekdays,
  };
}
