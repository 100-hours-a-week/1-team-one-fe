import { useMemo } from 'react';

import {
  EXERCISE_SESSION_REPORT_MESSAGES,
  ReportList,
  useExerciseSessionReportsQuery,
} from '@/src/features/exercise-session-report';
import { LoadableBoundary } from '@/src/shared/ui/boundary';
import { ErrorScreen } from '@/src/shared/ui/error-screen';

import { ReportsListSectionSkeleton } from './ReportsListSection.skeleton';

export function ReportsListSection() {
  const { data, isLoading, error } = useExerciseSessionReportsQuery();

  const reports = useMemo(() => data?.reports ?? [], [data]);
  const hasData = Boolean(data);
  const resolvedReports = hasData ? reports : undefined;
  const isEmpty = hasData && reports.length === 0;

  return (
    <LoadableBoundary
      isLoading={isLoading}
      error={error}
      data={resolvedReports}
      isEmpty={isEmpty}
      renderLoading={() => <ReportsListSectionSkeleton />}
      renderError={() => <ErrorScreen variant="unexpected" />}
      renderEmpty={() => (
        <div className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-6">
          <div className="text-text-muted flex justify-center py-8 text-sm">
            {EXERCISE_SESSION_REPORT_MESSAGES.LIST.EMPTY}
          </div>
        </div>
      )}
    >
      {(items) => (
        <div className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-6">
          <ReportList items={items} />
        </div>
      )}
    </LoadableBoundary>
  );
}
