import type { StatsSummaryDataType } from '@/src/entities/stats';

import { STATS_SUMMARY_THRESHOLDS } from '../config/constants';
import type { StatsSummaryViewModel, WeeklyDeltaDirection, WeeklySuccessTone } from './types';

function resolveWeeklySuccessTone(weeklySuccess: number): WeeklySuccessTone {
  if (weeklySuccess >= STATS_SUMMARY_THRESHOLDS.WEEKLY_SUCCESS.SUCCESS) {
    return 'success';
  }

  if (weeklySuccess >= STATS_SUMMARY_THRESHOLDS.WEEKLY_SUCCESS.BRAND) {
    return 'brand';
  }

  return 'neutral';
}

function resolveWeeklyDeltaDirection(weeklyDelta: number): WeeklyDeltaDirection {
  if (weeklyDelta > 0) {
    return 'up';
  }

  if (weeklyDelta < 0) {
    return 'down';
  }

  return 'same';
}

export function buildStatsSummaryViewModel(summary: StatsSummaryDataType): StatsSummaryViewModel {
  const weeklyDelta = summary.weeklySuccess - summary.lastWeekSuccess;

  return {
    streak: summary.streak,
    todaySuccess: summary.todaySuccess,
    weeklySuccess: summary.weeklySuccess,
    lastWeekSuccess: summary.lastWeekSuccess,
    weeklySuccessTone: resolveWeeklySuccessTone(summary.weeklySuccess),
    weeklyDelta,
    weeklyDeltaDirection: resolveWeeklyDeltaDirection(weeklyDelta),
  };
}
