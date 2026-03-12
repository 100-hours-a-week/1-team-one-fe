export const STATS_MONTH_SELECTOR_CONFIG = {
  MONTH_FORMAT: 'yyyy-MM',
  MONTH_LABEL_FORMAT: 'yyyy년 M월',
} as const;

const MONTH_STRING_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export function isStatsMonthString(value: string): boolean {
  return MONTH_STRING_PATTERN.test(value);
}
