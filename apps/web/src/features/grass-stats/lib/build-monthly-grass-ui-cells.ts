import { format, getDaysInMonth, parse } from 'date-fns';

import { normalizeStatsMonth } from '@/src/features/stats-month-selector';

import type { GrassStatsItem } from '../api/types';
import { GRASS_LEVELS, GRASS_RATIO_THRESHOLDS } from '../config/constants';
import type { MonthlyGrassCell } from '../model/monthly-grass.types';

const MONTH_START_DAY = '01';
const DATE_FORMAT = 'yyyy-MM-dd';

function createMonthStartDate(selectedMonth: string) {
  const normalizedMonth = normalizeStatsMonth(selectedMonth);
  return parse(`${normalizedMonth}-${MONTH_START_DAY}`, DATE_FORMAT, new Date());
}

function createGrassStatsMap(grassItems: GrassStatsItem[]) {
  return new Map(grassItems.map((item) => [item.date, item] as const));
}

function calculateRatio(successCount: number, targetCount: number): number {
  if (targetCount === 0) return 0;
  return successCount / targetCount;
}

function calculateGrassLevel(ratio: number): MonthlyGrassCell['level'] {
  if (ratio === 0) return GRASS_LEVELS.NONE;
  if (ratio < GRASS_RATIO_THRESHOLDS.LOW) return GRASS_LEVELS.LOW;
  if (ratio < GRASS_RATIO_THRESHOLDS.MEDIUM) return GRASS_LEVELS.MEDIUM;
  if (ratio < GRASS_RATIO_THRESHOLDS.HIGH) return GRASS_LEVELS.HIGH;
  return GRASS_LEVELS.FULL;
}

export function buildMonthlyGrassUICells(
  selectedMonth: string,
  grassItems: GrassStatsItem[],
): MonthlyGrassCell[] {
  const monthStartDate = createMonthStartDate(selectedMonth);
  const totalDays = getDaysInMonth(monthStartDate);
  const grassStatsMap = createGrassStatsMap(grassItems);

  return Array.from({ length: totalDays }, (_, index) => {
    const day = index + 1;
    const cellDate = new Date(monthStartDate);
    cellDate.setDate(day);
    const formattedDate = format(cellDate, DATE_FORMAT);

    const grassItem = grassStatsMap.get(formattedDate);
    const successCount = grassItem?.successCount ?? 0;
    const targetCount = grassItem?.targetCount ?? 0;
    const ratio = calculateRatio(successCount, targetCount);
    const level = calculateGrassLevel(ratio);

    return {
      date: formattedDate,
      day,
      level,
      successCount,
      targetCount,
      ratio,
    };
  });
}
