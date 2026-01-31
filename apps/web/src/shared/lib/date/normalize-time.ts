import { format, isValid, parse, parseISO } from 'date-fns';

const TIME_PARSE_FORMATS = ['HH:mm:ss', 'HH:mm'] as const;

const parseTimeValue = (value: string): Date | null => {
  const parsedIso = parseISO(value);
  if (isValid(parsedIso)) return parsedIso;

  for (const formatString of TIME_PARSE_FORMATS) {
    const parsed = parse(value, formatString, new Date());
    if (isValid(parsed)) return parsed;
  }

  return null;
};

export function normalizeTimeString(
  value: string | undefined,
  fallback: string,
  outputFormat: string,
): string {
  if (!value) return fallback;

  const parsed = parseTimeValue(value);
  if (!parsed) return fallback;

  return format(parsed, outputFormat);
}
