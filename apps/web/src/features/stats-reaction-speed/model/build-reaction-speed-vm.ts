import type { StatsReactionSpeedDataType } from '@/src/entities/stats';

import {
  STATS_REACTION_SPEED_BADGE_THRESHOLDS,
  STATS_REACTION_SPEED_METRICS,
  STATS_REACTION_SPEED_RATE_RANGE,
} from '../config/constants';
import { STATS_REACTION_SPEED_MESSAGES } from '../config/messages';
import type { ReactionSpeedBadgeTone, ReactionSpeedViewModel } from './types';

function clampRate(rate: number) {
  return Math.min(
    STATS_REACTION_SPEED_RATE_RANGE.MAX,
    Math.max(STATS_REACTION_SPEED_RATE_RANGE.MIN, rate),
  );
}

function formatAverageMinutes(speed: number) {
  const minuteValue = speed / STATS_REACTION_SPEED_METRICS.SECONDS_PER_MINUTE;
  const roundedMinuteValue = Number(
    minuteValue.toFixed(STATS_REACTION_SPEED_METRICS.MINUTE_DECIMALS),
  );

  return roundedMinuteValue.toString();
}

function resolveBadgeTone(rate: number): ReactionSpeedBadgeTone {
  if (rate <= STATS_REACTION_SPEED_BADGE_THRESHOLDS.FAST_MAX_RATE) {
    return 'fast';
  }

  if (rate <= STATS_REACTION_SPEED_BADGE_THRESHOLDS.NORMAL_MAX_RATE) {
    return 'normal';
  }

  return 'slow';
}

function resolveBadgeSubtitle(tone: ReactionSpeedBadgeTone) {
  switch (tone) {
    case 'fast':
      return STATS_REACTION_SPEED_MESSAGES.BADGE.FAST;
    case 'normal':
      return STATS_REACTION_SPEED_MESSAGES.BADGE.NORMAL;
    case 'slow':
      return STATS_REACTION_SPEED_MESSAGES.BADGE.SLOW;
    case 'empty':
      return STATS_REACTION_SPEED_MESSAGES.BADGE.EMPTY_SUBTITLE;
    default:
      return STATS_REACTION_SPEED_MESSAGES.BADGE.EMPTY_SUBTITLE;
  }
}

function formatBadgeTitle(rate: number) {
  return `${STATS_REACTION_SPEED_MESSAGES.BADGE.PREFIX} ${rate}${STATS_REACTION_SPEED_MESSAGES.UNITS.PERCENT}`;
}

export function buildReactionSpeedViewModel(
  reactionSpeed: StatsReactionSpeedDataType,
): ReactionSpeedViewModel {
  const speed = reactionSpeed.speed;
  const rate = reactionSpeed.rate;
  const hasAverageSpeed = speed !== null;

  const averageMinutesText =
    speed === null
      ? STATS_REACTION_SPEED_MESSAGES.PLACEHOLDER.EMPTY_VALUE
      : formatAverageMinutes(speed);

  if (rate === null) {
    return {
      averageMinutesText,
      hasAverageSpeed,
      markerPositionPercent: 0,
      hasRate: false,
      badgeTitle: STATS_REACTION_SPEED_MESSAGES.BADGE.EMPTY_TITLE,
      badgeSubtitle: resolveBadgeSubtitle('empty'),
      badgeTone: 'empty',
    };
  }

  const clampedRate = clampRate(rate);
  const badgeTone = resolveBadgeTone(clampedRate);

  return {
    averageMinutesText,
    hasAverageSpeed,
    markerPositionPercent: 100 - clampedRate,
    hasRate: true,
    badgeTitle: formatBadgeTitle(clampedRate),
    badgeSubtitle: resolveBadgeSubtitle(badgeTone),
    badgeTone,
  };
}
