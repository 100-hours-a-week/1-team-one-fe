import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Chip } from '@repo/ui/chip';
import Link from 'next/link';

import type { ExerciseSessionReportListItemType } from '@/src/entities/exercise-session-report';
import { formatRelativeTimeLabel, formatTimeLabel } from '@/src/shared/lib/date/display-date';
import { buildReportDetailPath } from '@/src/shared/routes';

import { EXERCISE_SESSION_REPORT_MESSAGES } from '../config/messages';

type ReportItemProps = {
  item: ExerciseSessionReportListItemType;
};

export function ReportItem({ item }: ReportItemProps) {
  const timeLabel = formatTimeLabel(item.createdAt);
  const relativeTimeLabel = formatRelativeTimeLabel(item.createdAt);

  return (
    <Link href={buildReportDetailPath(item.sessionReportId)} className="block">
      <Card
        padding="md"
        variant="elevated"
        className="bg-bg-subtle hover:bg-bg-muted shadow-none transition-colors"
      >
        <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 p-0">
          <Chip label={timeLabel} size="sm" variant="date" />
          <span
            className="text-text-muted text-xs"
            aria-label={EXERCISE_SESSION_REPORT_MESSAGES.ITEM.RELATIVE_TIME_ARIA}
          >
            {relativeTimeLabel}
          </span>
        </CardHeader>

        <CardContent className="mt-3 flex flex-col gap-1 p-0">
          <CardTitle className="text-text text-sm font-semibold tracking-normal">
            {EXERCISE_SESSION_REPORT_MESSAGES.ITEM.TITLE_PREFIX} #{item.sessionReportId}
          </CardTitle>
        </CardContent>
      </Card>
    </Link>
  );
}
