import { Card } from '@repo/ui/card';
import { Chip } from '@repo/ui/chip';
import { cn } from '@repo/ui/lib/utils';
import { Minus, Target, TrendingDown, TrendingUp } from 'lucide-react';

import { isApiError } from '@/src/shared/api';
import { LoadableBoundary } from '@/src/shared/ui/boundary';

import { useStatsSummaryQuery } from '../api/useStatsSummaryQuery';
import { STATS_SUMMARY_MESSAGES } from '../config/messages';
import { buildStatsSummaryViewModel } from '../model/build-stats-summary-vm';
import type {
  StatsSummaryViewModel,
  WeeklyDeltaDirection,
  WeeklySuccessTone,
} from '../model/types';
import { StatsSummarySectionSkeleton } from './StatsSummarySection.skeleton';

function formatStreakLabel(streak: number) {
  return `${streak}${STATS_SUMMARY_MESSAGES.UNITS.DAY}`;
}

function formatTodayLabel(todaySuccess: number) {
  return `${todaySuccess}${STATS_SUMMARY_MESSAGES.UNITS.TODAY}`;
}

function formatWeeklySuccessLabel(weeklySuccess: number) {
  return `${weeklySuccess}${STATS_SUMMARY_MESSAGES.UNITS.WEEKLY_COUNT}`;
}

function formatLastWeekLabel(lastWeekSuccess: number) {
  return `${STATS_SUMMARY_MESSAGES.LABELS.LAST_WEEK_PREFIX} ${lastWeekSuccess}${STATS_SUMMARY_MESSAGES.UNITS.WEEKLY_DELTA}`;
}

function formatWeeklyDeltaLabel(weeklyDelta: number) {
  if (weeklyDelta > 0) {
    return `+${weeklyDelta}${STATS_SUMMARY_MESSAGES.UNITS.WEEKLY_DELTA}`;
  }

  if (weeklyDelta < 0) {
    return `-${Math.abs(weeklyDelta)}${STATS_SUMMARY_MESSAGES.UNITS.WEEKLY_DELTA}`;
  }

  return `0${STATS_SUMMARY_MESSAGES.UNITS.WEEKLY_DELTA}`;
}

function getWeeklySuccessCountClassName(tone: WeeklySuccessTone) {
  switch (tone) {
    case 'success':
      return 'text-success-700';
    case 'brand':
      return 'text-brand-700';
    case 'neutral':
      return 'text-text';
    default:
      return 'text-text';
  }
}

function getWeeklyDeltaClassName(direction: WeeklyDeltaDirection) {
  switch (direction) {
    case 'up':
      return 'text-success-700';
    case 'down':
      return 'text-error-700';
    case 'same':
      return 'text-text-muted';
    default:
      return 'text-text-muted';
  }
}

function WeeklyDeltaIcon({ direction }: { direction: WeeklyDeltaDirection }) {
  switch (direction) {
    case 'up':
      return <TrendingUp aria-hidden="true" className="size-3.5" />;
    case 'down':
      return <TrendingDown aria-hidden="true" className="size-3.5" />;
    case 'same':
      return <Minus aria-hidden="true" className="size-3.5" />;
    default:
      return <Minus aria-hidden="true" className="size-3.5" />;
  }
}

function StatsSummaryContent({ summary }: { summary: StatsSummaryViewModel }) {
  return (
    <section className="flex flex-col gap-4">
      {/* 연속 달성/투데이 패널 */}
      <Card variant="elevated" padding="md" className="bg-bg-subtle shadow-none">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center gap-1">
            <p className="text-text-muted text-sm font-medium">
              {STATS_SUMMARY_MESSAGES.PANELS.STREAK}
            </p>
            <p className="text-text text-4xl font-bold tabular-nums">
              {formatStreakLabel(summary.streak)}
            </p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-text-muted text-sm font-medium">
              {STATS_SUMMARY_MESSAGES.PANELS.TODAY}
            </p>
            <p className="text-text text-4xl font-bold tabular-nums">
              {formatTodayLabel(summary.todaySuccess)}
            </p>
          </div>
        </div>
      </Card>

      {/* 이번주 성공 현황 패널 */}
      <Card variant="elevated" padding="md" className="bg-success-50 shadow-none">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-text flex items-center gap-2 text-base font-semibold">
            <Target aria-hidden="true" className="text-success-700 size-4" />
            <span>{STATS_SUMMARY_MESSAGES.PANELS.WEEKLY_TITLE}</span>
          </p>
          <Chip size="sm" variant="date" label={STATS_SUMMARY_MESSAGES.PANELS.WEEKLY_BADGE} />
        </div>

        <div className="bg-surface rounded-xl px-4 py-5">
          <div className="flex flex-col items-center gap-1">
            <p className="text-text-muted text-xs font-medium">
              {STATS_SUMMARY_MESSAGES.LABELS.WEEKLY_COUNT}
            </p>
            <p
              className={cn(
                'text-5xl font-bold tabular-nums',
                getWeeklySuccessCountClassName(summary.weeklySuccessTone),
              )}
            >
              {formatWeeklySuccessLabel(summary.weeklySuccess)}
            </p>
            <p className="text-text-muted text-xs">
              {STATS_SUMMARY_MESSAGES.LABELS.WEEKLY_SUBTITLE}
            </p>
          </div>

          <div className="bg-success-50 mt-4 rounded-lg px-3 py-2">
            <p className="text-text-muted text-center text-xs font-medium">
              {STATS_SUMMARY_MESSAGES.LABELS.WEEKLY_COMPARE}
            </p>
            <div className="mt-1 flex items-center justify-center gap-2">
              <p className="text-text-muted text-sm">
                {formatLastWeekLabel(summary.lastWeekSuccess)}
              </p>
              <p
                className={cn(
                  'inline-flex items-center gap-1 text-sm font-semibold tabular-nums',
                  getWeeklyDeltaClassName(summary.weeklyDeltaDirection),
                )}
              >
                <WeeklyDeltaIcon direction={summary.weeklyDeltaDirection} />
                <span>{formatWeeklyDeltaLabel(summary.weeklyDelta)}</span>
              </p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

function StatsSummaryErrorState({ error }: { error: Error | unknown }) {
  if (isApiError(error) && error.code === 'CHARACTER_NOT_SET') {
    return (
      <Card variant="elevated" padding="md" className="bg-bg-subtle shadow-none">
        <p className="text-text-muted text-sm">{STATS_SUMMARY_MESSAGES.STATE.CHARACTER_NOT_SET}</p>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="md" className="bg-bg-subtle shadow-none">
      <p className="text-error-600 text-sm">{STATS_SUMMARY_MESSAGES.STATE.UNEXPECTED_ERROR}</p>
    </Card>
  );
}

export function StatsSummarySection() {
  const statsSummaryQuery = useStatsSummaryQuery();

  return (
    <LoadableBoundary
      isLoading={statsSummaryQuery.isLoading}
      isFetching={statsSummaryQuery.isFetching}
      error={statsSummaryQuery.error}
      data={statsSummaryQuery.data}
      skipDelay
      renderLoading={() => <StatsSummarySectionSkeleton />}
      renderError={(error) => <StatsSummaryErrorState error={error} />}
    >
      {(summary) => <StatsSummaryContent summary={buildStatsSummaryViewModel(summary)} />}
    </LoadableBoundary>
  );
}
