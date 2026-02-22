import { Shimmer } from '@repo/ui/shimmer';
import { Skeleton } from '@repo/ui/skeleton';
import { SkeletonAvatar } from '@repo/ui/skeleton-avatar';
import { SkeletonText } from '@repo/ui/skeleton-text';

const SKELETON_POST_COUNT = 2;

export function MomentsPageSkeleton() {
  return (
    <div className="flex flex-col px-4 pt-4 pb-6">
      <Shimmer>
        <div className="flex flex-col gap-4">
          {Array.from({ length: SKELETON_POST_COUNT }).map((_, index) => (
            <div
              key={`moments-post-skeleton-${index}`}
              className="bg-surface shadow--sm overflow-hidden rounded-lg"
            >
              <div className="px-4 pt-4">
                <div className="flex items-center gap-3 pb-4">
                  <SkeletonAvatar size="md" />
                  <div className="flex flex-1 flex-col gap-2">
                    <SkeletonText lines={1} widths={['30%']} />
                    <SkeletonText lines={1} widths={['45%']} />
                  </div>
                </div>
              </div>

              <Skeleton className="h-48 w-full rounded-none" />

              <div className="flex flex-col gap-2 px-4 pb-4">
                <SkeletonText lines={1} widths={['60%']} />
                <SkeletonText lines={3} widths={['90%', '80%', '70%']} />
              </div>

              <div className="flex flex-col gap-3 px-4 pb-4">
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-14 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
                <div className="flex justify-end">
                  <Skeleton className="h-7 w-14 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Shimmer>
    </div>
  );
}
