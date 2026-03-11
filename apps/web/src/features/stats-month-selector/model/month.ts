import { addMonths, format, isValid, parse } from 'date-fns';

import { isStatsMonthString, STATS_MONTH_SELECTOR_CONFIG } from '../config/constants';

/**
 * YYYY-MM 문자열을 유효성 검사 후 Date로 파싱
 * 형식/유효성/역포맷 검증
 */
function parseStatsMonth(value: string): Date | null {
  if (!isStatsMonthString(value)) {
    return null;
  }

  const parsed = parse(value, STATS_MONTH_SELECTOR_CONFIG.MONTH_FORMAT, new Date());
  if (!isValid(parsed)) {
    return null;
  }

  if (format(parsed, STATS_MONTH_SELECTOR_CONFIG.MONTH_FORMAT) !== value) {
    return null;
  }

  return parsed;
}

/**
 * 현재 시각 기준 월을 YYYY-MM 문자열로 반환
 */
export function getCurrentStatsMonth(): string {
  return format(new Date(), STATS_MONTH_SELECTOR_CONFIG.MONTH_FORMAT);
}

/**
 * 입력 월 문자열을 정규화
 * 현재 월 fallback
 */
export function normalizeStatsMonth(value: string | null | undefined): string {
  if (!value) {
    return getCurrentStatsMonth();
  }

  const parsed = parseStatsMonth(value);
  if (!parsed) {
    return getCurrentStatsMonth();
  }

  return format(parsed, STATS_MONTH_SELECTOR_CONFIG.MONTH_FORMAT);
}

/**
 * 기준 월에서 amount(음수/양수)만큼 이동한 월을 YYYY-MM으로 반환
 * 현재 월을 기준으로 계산한 것을 fallback
 */
export function shiftStatsMonth(month: string, amount: number): string {
  const normalizedMonth = normalizeStatsMonth(month);
  const parsed = parse(normalizedMonth, STATS_MONTH_SELECTOR_CONFIG.MONTH_FORMAT, new Date());
  if (!isValid(parsed)) {
    return getCurrentStatsMonth();
  }

  return format(addMonths(parsed, amount), STATS_MONTH_SELECTOR_CONFIG.MONTH_FORMAT);
}

/**
 * YYYY-MM 월 값을 사용자 표시용 라벨(yyyy년 M월)로 변환
 */
export function formatStatsMonthLabel(month: string): string {
  const normalizedMonth = normalizeStatsMonth(month);
  const parsed = parse(normalizedMonth, STATS_MONTH_SELECTOR_CONFIG.MONTH_FORMAT, new Date());
  if (!isValid(parsed)) {
    return normalizedMonth;
  }

  return format(parsed, STATS_MONTH_SELECTOR_CONFIG.MONTH_LABEL_FORMAT);
}
