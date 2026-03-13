import type { StatsReactionSpeedViewType } from '@/src/entities/stats';

import { STATS_REACTION_SPEED_MESSAGES } from './messages';

export const STATS_REACTION_SPEED_DEFAULT_VIEW: StatsReactionSpeedViewType = 'WEEKLY';

export const STATS_REACTION_SPEED_FILTERS = [
  {
    value: 'WEEKLY' as const,
    label: STATS_REACTION_SPEED_MESSAGES.FILTER.WEEKLY,
  },
  {
    value: 'MONTHLY' as const,
    label: STATS_REACTION_SPEED_MESSAGES.FILTER.MONTHLY,
  },
  {
    value: 'TOTAL' as const,
    label: STATS_REACTION_SPEED_MESSAGES.FILTER.TOTAL,
  },
] as const;

export const STATS_REACTION_SPEED_METRICS = {
  SECONDS_PER_MINUTE: 60,
  MINUTE_DECIMALS: 1,
} as const;

export const STATS_REACTION_SPEED_RATE_RANGE = {
  MIN: 1,
  MAX: 100,
} as const;

export const STATS_REACTION_SPEED_BADGE_THRESHOLDS = {
  FAST_MAX_RATE: 20,
  NORMAL_MAX_RATE: 50,
} as const;
