import { Shimmer } from '@repo/ui/shimmer';
import { Skeleton } from '@repo/ui/skeleton';
import { SkeletonCard } from '@repo/ui/skeleton-card';
import { SkeletonText } from '@repo/ui/skeleton-text';

const SKELETON_CARD_COUNT = 3;

export function AppPlanPageSkeleton() {
  return (
    <Shimmer>
      <div className="flex min-h-screen flex-col gap-6 px-5 pb-6">
        <div className="flex items-center justify-between pt-4">
          <SkeletonText lines={1} widths={['40%']} />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>

        <section className="flex flex-col gap-4">
          {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
            <SkeletonCard key={`plan-card-${index}`} padding="md" className="h-40" />
          ))}
        </section>
      </div>
    </Shimmer>
  );
}
