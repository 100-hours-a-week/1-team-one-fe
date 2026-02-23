import { Shimmer } from '@repo/ui/shimmer';
import { SkeletonCard } from '@repo/ui/skeleton-card';
import { SkeletonText } from '@repo/ui/skeleton-text';

export function MomentsListSkeleton() {
  return (
    <Shimmer>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={`moments-list-skeleton-${index}`} className="flex flex-col gap-3">
            <SkeletonCard height="80px" padding="md" />
            <SkeletonCard height="200px" />
            <SkeletonText lines={2} widths={['80%', '60%']} />
            <SkeletonText lines={1} widths={['30%']} />
          </div>
        ))}
      </div>
    </Shimmer>
  );
}
