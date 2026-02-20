import { Shimmer } from '@repo/ui/shimmer';
import { SkeletonAvatar } from '@repo/ui/skeleton-avatar';
import { SkeletonText } from '@repo/ui/skeleton-text';

const Divider = () => <div className="border-border my-4 border-t" />;

export function MomentsDetailPageSkeleton() {
  return (
    <Shimmer>
      <article className="mx-auto flex w-full max-w-3xl flex-col px-4 py-6">
        {/* Header: Avatar + Author info */}
        <div className="flex items-center gap-3 py-4">
          <SkeletonAvatar size="md" />
          <div className="flex flex-1 flex-col gap-2">
            <SkeletonText lines={1} widths={['40%']} />
            <SkeletonText lines={1} widths={['60%']} />
          </div>
        </div>
        <Divider />

        {/* Title */}
        <div className="py-4">
          <SkeletonText lines={1} widths={['80%']} />
        </div>
        <Divider />

        {/* Content */}
        <div className="py-4">
          <SkeletonText lines={4} widths={['100%', '100%', '100%', '70%']} />
        </div>
        <Divider />

        {/* Like count placeholder */}
        <div className="py-4">
          <SkeletonText lines={1} widths={['20%']} />
        </div>
      </article>
    </Shimmer>
  );
}
