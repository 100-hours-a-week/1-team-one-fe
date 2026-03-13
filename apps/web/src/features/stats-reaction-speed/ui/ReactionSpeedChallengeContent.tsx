import { cn } from '@repo/ui/lib/utils';
import { Star } from 'lucide-react';

import { STATS_REACTION_SPEED_MESSAGES } from '../config/messages';
import type { ReactionSpeedBadgeTone, ReactionSpeedViewModel } from '../model/types';

function getBadgeClassName(tone: ReactionSpeedBadgeTone) {
  switch (tone) {
    case 'fast':
      return 'bg-warning-500 text-white';
    case 'normal':
      return 'bg-brand-500 text-white';
    case 'slow':
      return 'bg-text-muted text-white';
    case 'empty':
      return 'bg-bg-subtle text-text';
    default:
      return 'bg-bg-subtle text-text';
  }
}

interface ReactionSpeedChallengeContentProps {
  viewModel: ReactionSpeedViewModel;
}

interface ReactionSpeedRankBadgeProps {
  tone: ReactionSpeedBadgeTone;
  title: string;
  subtitle: string;
}

interface ReactionSpeedAverageMinutesPanelProps {
  averageSpeedValueText: string;
  averageSpeedUnitText: string;
}

function ReactionSpeedAverageMinutesPanel({
  averageSpeedValueText,
  averageSpeedUnitText,
}: ReactionSpeedAverageMinutesPanelProps) {
  return (
    <div className="flex flex-1 flex-col items-center">
      <p className="text-text-muted text-xs font-medium">
        {STATS_REACTION_SPEED_MESSAGES.LABELS.AVERAGE_SPEED}
      </p>
      <div className="mt-2 flex items-end justify-center gap-1">
        <p className="text-warning-700 text-5xl leading-none font-bold tabular-nums">
          {averageSpeedValueText}
        </p>
        {averageSpeedUnitText ? (
          <span className="text-text text-base leading-none font-semibold">
            {averageSpeedUnitText}
          </span>
        ) : null}
      </div>
    </div>
  );
}

interface ReactionSpeedPercentileVisualizationPanelProps {
  hasRate: boolean;
  markerPositionPercent: number;
}

function ReactionSpeedPercentileVisualizationPanel({
  hasRate,
  markerPositionPercent,
}: ReactionSpeedPercentileVisualizationPanelProps) {
  return (
    <div className="mt-6 w-full flex-1">
      <p className="text-text-muted text-center text-xs font-medium">
        {STATS_REACTION_SPEED_MESSAGES.LABELS.RANK}
      </p>
      <div className="relative mt-3">
        <div className="from-error-100 via-warning-100 to-success-100 h-10 rounded-full bg-linear-to-r" />
        {hasRate ? (
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${markerPositionPercent}%` }}
          >
            <span className="bg-warning-700 block h-8 w-1 rounded-full" />
          </div>
        ) : null}
      </div>
      <div className="text-text-muted mt-2 grid grid-cols-3 text-xs font-medium">
        <span>{STATS_REACTION_SPEED_MESSAGES.LABELS.SLOW}</span>
        <span className="text-center">{STATS_REACTION_SPEED_MESSAGES.LABELS.NORMAL}</span>
        <span className="text-success-700 text-right">
          {STATS_REACTION_SPEED_MESSAGES.LABELS.FAST}
        </span>
      </div>
    </div>
  );
}

function ReactionSpeedRankBadge({ tone, title, subtitle }: ReactionSpeedRankBadgeProps) {
  return (
    <div
      className={cn(
        'mx-auto mt-6 inline-flex min-w-44 flex-col items-center rounded-full px-6 py-3 shadow-[var(--shadow-sm)]',
        getBadgeClassName(tone),
      )}
    >
      <p className="flex w-full items-center justify-center gap-1 text-center text-xl font-bold">
        <Star aria-hidden="true" className="size-3.5 fill-current" />
        <span>{title}</span>
      </p>
      <p className="mt-1 text-center text-xs font-medium">{subtitle}</p>
    </div>
  );
}

export function ReactionSpeedChallengeContent({ viewModel }: ReactionSpeedChallengeContentProps) {
  return (
    <div className="bg-surface mt-3 flex flex-col items-center rounded-2xl px-4 py-5">
      <ReactionSpeedAverageMinutesPanel
        averageSpeedValueText={viewModel.averageSpeedValueText}
        averageSpeedUnitText={viewModel.averageSpeedUnitText}
      />
      <ReactionSpeedPercentileVisualizationPanel
        hasRate={viewModel.hasRate}
        markerPositionPercent={viewModel.markerPositionPercent}
      />

      <ReactionSpeedRankBadge
        tone={viewModel.badgeTone}
        title={viewModel.badgeTitle}
        subtitle={viewModel.badgeSubtitle}
      />
    </div>
  );
}
