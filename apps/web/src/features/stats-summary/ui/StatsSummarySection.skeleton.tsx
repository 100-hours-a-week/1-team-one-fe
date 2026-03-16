import { Card } from '@repo/ui/card';
import { Skeleton } from '@repo/ui/skeleton';

export function StatsSummarySectionSkeleton() {
  return (
    <section className="flex flex-col gap-4">
      <Card variant="elevated" padding="md" className="bg-bg-subtle shadow-none">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-14" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-14" />
          </div>
        </div>
      </Card>

      <Card variant="elevated" padding="md" className="bg-success-50 shadow-none">
        <div className="mb-3 flex items-center justify-between gap-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>

        <div className="bg-surface rounded-xl px-4 py-5">
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-11 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>

          <div className="bg-success-50 mt-4 rounded-lg px-3 py-2">
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-14" />
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
