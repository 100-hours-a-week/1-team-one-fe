import { Shimmer } from '@repo/ui/shimmer';
import { Skeleton } from '@repo/ui/skeleton';
import { SkeletonText } from '@repo/ui/skeleton-text';

const INPUT_ROWS = 4;
const OPTION_ROWS = 3;

export function AppAlarmPageSkeleton() {
  return (
    <Shimmer>
      <div className="mx-auto flex h-full w-full max-w-2xl flex-col justify-center gap-6 p-6">
        <div className="border-border rounded-lg border p-6">
          <div className="space-y-6">
            <SkeletonText lines={1} widths={['30%']} />

            <div className="space-y-3">
              <SkeletonText lines={1} widths={['24%']} />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            <div className="space-y-3">
              <SkeletonText lines={1} widths={['22%']} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>

            <div className="space-y-3">
              <SkeletonText lines={1} widths={['22%']} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>

            <div className="space-y-3">
              <SkeletonText lines={1} widths={['20%']} />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: OPTION_ROWS }).map((_, index) => (
                  <Skeleton key={`weekday-${index}`} className="h-8 w-16 rounded-full" />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {Array.from({ length: INPUT_ROWS }).map((_, index) => (
                <Skeleton key={`row-${index}`} className="h-10 w-full rounded-md" />
              ))}
            </div>
          </div>
        </div>

        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    </Shimmer>
  );
}
