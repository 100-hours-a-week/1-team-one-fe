import { tz } from '@date-fns/tz';
import { addMinutes, addYears, format, isAfter, isValid, parseISO } from 'date-fns';

import {
  DND_DURATION_MINUTES,
  DND_INFINITE_YEARS,
  DND_OPTION_IDS,
  type DndOptionIdType,
} from '../config/constants';
import { DND_MESSAGES } from '../config/messages';

const getLocalTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
const UTC_TIMEZONE = 'UTC';
const TZ_SUFFIX_PATTERN = /([zZ]|[+-]\d{2}:?\d{2})$/;

const getZonedDateKey = (date: Date, timeZone: string) =>
  format(date, 'yyyy-MM-dd', { in: tz(timeZone) });

const normalizeDndIso = (value: string): string => {
  if (TZ_SUFFIX_PATTERN.test(value)) return value;
  return `${value}Z`;
};

const parseDndDate = (value: string): Date => parseISO(normalizeDndIso(value));

export function getDndFinishedAt(optionId: DndOptionIdType, now: Date = new Date()): Date {
  switch (optionId) {
    case DND_OPTION_IDS.MINUTES_15:
      return addMinutes(now, DND_DURATION_MINUTES.MINUTES_15);
    case DND_OPTION_IDS.HOURS_1:
      return addMinutes(now, DND_DURATION_MINUTES.HOURS_1);
    case DND_OPTION_IDS.HOURS_8:
      return addMinutes(now, DND_DURATION_MINUTES.HOURS_8);
    case DND_OPTION_IDS.HOURS_24:
      return addMinutes(now, DND_DURATION_MINUTES.HOURS_24);
    case DND_OPTION_IDS.DAYS_3:
      return addMinutes(now, DND_DURATION_MINUTES.DAYS_3);
    case DND_OPTION_IDS.INFINITE:
      return addYears(now, DND_INFINITE_YEARS);
    default:
      return now;
  }
}

export function toDndPayloadUtc(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'", { in: tz(UTC_TIMEZONE) });
}

export function isDndInfinite(finishedAt: Date, now: Date = new Date()): boolean {
  const threshold = addYears(now, DND_INFINITE_YEARS - 1);
  return isAfter(finishedAt, threshold) || finishedAt.getTime() === threshold.getTime();
}

export function isDndActive(dnd: boolean | undefined, finishedAt?: string | null): boolean {
  if (!finishedAt) return false;

  const parsed = parseDndDate(finishedAt);
  if (!isValid(parsed)) return false;
  return isAfter(parsed, new Date());
}

export function formatDndUntilLabel(finishedAt?: string | null, now: Date = new Date()): string {
  if (!finishedAt) return '';

  const parsed = parseDndDate(finishedAt);
  if (!isValid(parsed)) return '';
  if (!isAfter(parsed, now)) return '';
  if (isDndInfinite(parsed, now)) return '';

  const timeZone = getLocalTimeZone();
  const nowKey = getZonedDateKey(now, timeZone);
  const parsedKey = getZonedDateKey(parsed, timeZone);

  if (parsedKey === nowKey) {
    return DND_MESSAGES.UNTIL_TODAY.replace(
      '{time}',
      format(parsed, 'HH:mm', { in: tz(timeZone) }),
    );
  }

  return DND_MESSAGES.UNTIL_DATE.replace('{month}', format(parsed, 'MM', { in: tz(timeZone) }))
    .replace('{day}', format(parsed, 'dd', { in: tz(timeZone) }))
    .replace('{hour}', format(parsed, 'HH', { in: tz(timeZone) }))
    .replace('{minute}', format(parsed, 'mm', { in: tz(timeZone) }));
}
