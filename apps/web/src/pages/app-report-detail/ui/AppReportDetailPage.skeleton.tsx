import { Card } from '@repo/ui/card';
import { Skeleton } from '@repo/ui/skeleton';

const SECTION_SKELETON_COUNT = 3;

export function AppReportDetailPageSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4 pb-6">
      {Array.from({ length: SECTION_SKELETON_COUNT }).map((_, index) => (
        <Card
          key={index}
          variant="elevated"
          padding="md"
          className="bg-bg-subtle border-0 shadow-none"
        >
          <div className="flex flex-col gap-2">
            <Skeleton variant="text" className="h-4 w-28" />
            <Skeleton variant="text" className="h-4 w-full" />
            <Skeleton variant="text" className="h-4 w-2/3" />
          </div>
        </Card>
      ))}
    </div>
  );
}
