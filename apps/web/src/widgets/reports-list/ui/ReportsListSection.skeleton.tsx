import { ReportListSkeleton } from '@/src/features/exercise-session-report';

export function ReportsListSectionSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-6">
        <ReportListSkeleton />
      </div>
    </div>
  );
}
