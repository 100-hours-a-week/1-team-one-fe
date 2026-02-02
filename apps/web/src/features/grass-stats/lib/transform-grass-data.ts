import type { Activity } from '@repo/ui/activity-calendar';

import type { GrassStatsItem } from '../api/types';
import { GRASS_LEVELS, GRASS_RATIO_THRESHOLDS } from '../config/constants';

function calculateLevel(successCount: number, targetCount: number): 0 | 1 | 2 | 3 | 4 {
  if (targetCount === 0) return GRASS_LEVELS.NONE;

  const ratio = successCount / targetCount;

  if (ratio === 0) return GRASS_LEVELS.NONE;
  if (ratio < GRASS_RATIO_THRESHOLDS.LOW) return GRASS_LEVELS.LOW;
  if (ratio < GRASS_RATIO_THRESHOLDS.MEDIUM) return GRASS_LEVELS.MEDIUM;
  if (ratio < GRASS_RATIO_THRESHOLDS.HIGH) return GRASS_LEVELS.HIGH;
  return GRASS_LEVELS.FULL;
}

function formatDate(date: Date): string {
  const isoString = date.toISOString().split('T')[0];
  if (!isoString) {
    throw new Error('Invalid date format');
  }
  return isoString;
}

function fillMissingDates(grassItems: GrassStatsItem[]): GrassStatsItem[] {
  const REQUIRED_DAYS = 7;

  // 데이터가 없는 경우 오늘부터 7일치 생성
  if (grassItems.length === 0) {
    const result: GrassStatsItem[] = [];
    const today = new Date();

    for (let i = REQUIRED_DAYS - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      result.push({
        date: formatDate(date),
        successCount: 0,
        targetCount: 0,
      });
    }

    return result;
  }

  // 데이터가 7개 이상인 경우 그대로 반환
  if (grassItems.length >= REQUIRED_DAYS) {
    return grassItems;
  }

  // 데이터가 7개 미만인 경우 가장 오래된 날짜 이전으로 채우기
  const sortedItems = [...grassItems].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const oldestItem = sortedItems[0];
  if (!oldestItem) {
    // 이론적으로 여기 도달할 수 없지만 타입 안전성을 위해
    return fillMissingDates([]);
  }

  const oldestDate = new Date(oldestItem.date);
  const missingCount = REQUIRED_DAYS - grassItems.length;
  const filledItems: GrassStatsItem[] = [];

  for (let i = missingCount; i > 0; i--) {
    const date = new Date(oldestDate);
    date.setDate(date.getDate() - i);
    filledItems.push({
      date: formatDate(date),
      successCount: 0,
      targetCount: 0,
    });
  }

  return [...filledItems, ...sortedItems];
}

export function transformGrassData(grassItems: GrassStatsItem[]): Activity[] {
  const filledData = fillMissingDates(grassItems);

  return filledData.map((item) => ({
    date: item.date,
    count: item.successCount,
    level: calculateLevel(item.successCount, item.targetCount),
    successCount: item.successCount,
    targetCount: item.targetCount,
  }));
}
