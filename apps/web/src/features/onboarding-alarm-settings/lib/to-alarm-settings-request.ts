import { normalizeTimeString } from '@/src/shared/lib/date/normalize-time';

import type { AlarmSettingsRequest } from '../api/types';
import type { AlarmSettingsValues } from './alarm-settings-schema';

const normalizeTimeWithSeconds = (value: string): string =>
  normalizeTimeString(value, value, 'HH:mm:ss');

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
