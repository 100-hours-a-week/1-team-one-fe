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

export function transformGrassData(grassItems: GrassStatsItem[]): Activity[] {
  return grassItems.map((item) => ({
    date: item.date,
    count: item.successCount,
    level: calculateLevel(item.successCount, item.targetCount),
  }));
}
