import type { StatsReactionSpeedViewType } from '../model/types';

export const STATS_QUERY_KEYS = {
  root: () => ['stats'] as const,
  summary: () => [...STATS_QUERY_KEYS.root(), 'summary'] as const,
  reactionSpeed: (view: StatsReactionSpeedViewType) =>
    [...STATS_QUERY_KEYS.root(), 'reaction-speed', view] as const,
} as const;
