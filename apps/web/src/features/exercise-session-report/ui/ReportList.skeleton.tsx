import { Shimmer } from '@repo/ui/shimmer';
import { SkeletonCard } from '@repo/ui/skeleton-card';
import { SkeletonText } from '@repo/ui/skeleton-text';

export function ReportListSkeleton() {
  return (
    <Shimmer>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <SkeletonText lines={1} widths={['22%']} />
          <SkeletonCard height="80px" padding="md" />
          <SkeletonCard height="80px" padding="md" />
        </div>

        <div className="flex flex-col gap-3">
          <SkeletonText lines={1} widths={['24%']} />
          <SkeletonCard height="80px" padding="md" />
        </div>
      </div>
    </Shimmer>
  );
}
