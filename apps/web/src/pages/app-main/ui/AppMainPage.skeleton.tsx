import { Shimmer } from '@repo/ui/shimmer';
import { SkeletonAvatar } from '@repo/ui/skeleton-avatar';
import { SkeletonCard } from '@repo/ui/skeleton-card';
import { SkeletonText } from '@repo/ui/skeleton-text';

export function AppMainPageSkeleton() {
  return (
    <Shimmer>
      <div className="flex flex-col gap-6 p-6 pb-20">
        <section aria-label="프로필 상태">
          <div className="bg-bg flex items-center gap-4 rounded-lg p-4">
            <SkeletonAvatar size="lg" />
            <div className="flex-1 space-y-3">
              <SkeletonText lines={1} widths={['40%']} />
              <div className="flex items-center gap-4">
                <SkeletonText lines={1} widths={['30%']} />
                <SkeletonText lines={1} widths={['30%']} />
              </div>
              <SkeletonCard height="8px" padding="sm" />
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center justify-center gap-2 px-5">
          <SkeletonCard height="300px" style={{ width: '400px', maxWidth: '100%' }} />
          <SkeletonText lines={1} widths={['50%']} className="mt-2" />
        </section>

        <section>
          <SkeletonCard height="200px" padding="md" />
        </section>

        <section className="flex gap-3">
          <div className="flex-1">
            <SkeletonCard height="140px" padding="md" />
          </div>
          <div className="flex-1">
            <SkeletonCard height="140px" padding="md" />
          </div>
        </section>
      </div>
    </Shimmer>
  );
}
