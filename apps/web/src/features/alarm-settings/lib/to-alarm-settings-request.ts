import type { AlarmSettingsRequestDTO } from '@/src/entities/alarm-settings';
import { normalizeTimeString } from '@/src/shared/lib/date/normalize-time';

import type { AlarmSettingsValuesType } from '../model/alarm-settings-schema';

const normalizeTimeWithSeconds = (value: string): string =>
  normalizeTimeString(value, value, 'HH:mm:ss');

export function toAlarmSettingsRequest(values: AlarmSettingsValuesType): AlarmSettingsRequestDTO {
  return {
    interval: values.intervalMinutes,
    activeStartAt: normalizeTimeWithSeconds(values.activeStart),
    activeEndAt: normalizeTimeWithSeconds(values.activeEnd),
    focusStartAt: normalizeTimeWithSeconds(values.focusStart),
    focusEndAt: normalizeTimeWithSeconds(values.focusEnd),
    repeatDays: values.weekdays,
  };
}
