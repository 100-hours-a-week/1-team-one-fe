import { format, formatDistanceToNowStrict, isValid, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

function parseDate(value: string): Date | null {
  const parsed = parseISO(value);
  if (isValid(parsed)) {
    return parsed;
  }

  const fallback = new Date(value);
  if (!isValid(fallback)) {
    return null;
  }

  return fallback;
}

export function getDateKey(value: string): string {
  const parsedDate = parseDate(value);
  if (!parsedDate) {
    return value;
  }

  return format(parsedDate, 'yyyy-MM-dd');
}

export function formatDateLabel(value: string): string {
  const parsedDate = parseDate(value);
  if (!parsedDate) {
    return value;
  }

  return format(parsedDate, 'yyyy.MM.dd');
}

export function formatDateTimeLabel(value: string): string {
  const parsedDate = parseDate(value);
  if (!parsedDate) {
    return value;
  }

  return format(parsedDate, 'yyyy.MM.dd HH:mm:ss');
}

export function formatTimeLabel(value: string): string {
  const parsedDate = parseDate(value);
  if (!parsedDate) {
    return value;
  }

  return format(parsedDate, 'HH:mm');
}

export function formatRelativeTimeLabel(value: string): string {
  const parsedDate = parseDate(value);
  if (!parsedDate) {
    return '-';
  }

  return formatDistanceToNowStrict(parsedDate, {
    addSuffix: true,
    locale: ko,
  });
}
