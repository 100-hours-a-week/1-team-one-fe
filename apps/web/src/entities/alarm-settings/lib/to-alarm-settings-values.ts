import { normalizeTimeString } from '@/src/shared/lib/date/normalize-time';

import { WEEKDAY_VALUES } from '../config/constants';
import type { AlarmSettings, AlarmSettingsFormValues, Weekday } from '../model/types';

type WeekdayValue = (typeof WEEKDAY_VALUES)[number];

const isWeekdayValue = (value: string): value is WeekdayValue =>
  WEEKDAY_VALUES.includes(value as WeekdayValue);

export function toAlarmSettingsValues(
  alarmSettings: AlarmSettings | undefined,
  fallback: AlarmSettingsFormValues,
): AlarmSettingsFormValues {
  if (!alarmSettings) return fallback;

  const weekdays: Weekday[] = alarmSettings.repeatDays?.filter(isWeekdayValue) ?? [];

  return {
    intervalMinutes:
      typeof alarmSettings.interval === 'number'
        ? alarmSettings.interval
        : fallback.intervalMinutes,
    activeStart: normalizeTimeString(alarmSettings.activeStartAt, fallback.activeStart, 'HH:mm'),
    activeEnd: normalizeTimeString(alarmSettings.activeEndAt, fallback.activeEnd, 'HH:mm'),
    focusStart: normalizeTimeString(alarmSettings.focusStartAt, fallback.focusStart, 'HH:mm'),
    focusEnd: normalizeTimeString(alarmSettings.focusEndAt, fallback.focusEnd, 'HH:mm'),
    weekdays: weekdays.length ? weekdays : fallback.weekdays,
  };
}
