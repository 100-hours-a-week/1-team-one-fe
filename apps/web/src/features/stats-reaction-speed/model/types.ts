import type { StatsReactionSpeedViewType } from '@/src/entities/stats';

export type ReactionSpeedFilterOption = {
  value: StatsReactionSpeedViewType;
  label: string;
};

export type ReactionSpeedBadgeTone = 'fast' | 'normal' | 'slow' | 'empty';

export type ReactionSpeedViewModel = {
  averageMinutesText: string;
  hasAverageSpeed: boolean;
  markerPositionPercent: number;
  hasRate: boolean;
  badgeTitle: string;
  badgeSubtitle: string;
  badgeTone: ReactionSpeedBadgeTone;
};
