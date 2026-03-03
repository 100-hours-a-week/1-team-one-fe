import { Card } from '@repo/ui/card';
import { Skeleton } from '@repo/ui/skeleton';
import { SkeletonAvatar } from '@repo/ui/skeleton-avatar';

export function UserStatusCardSectionSkeleton() {
  return (
    <section aria-label="프로필 상태">
      <Card padding="md" variant="elevated" className="w-full">
        <div className="flex items-start gap-4">
          <SkeletonAvatar size="md" />
          <div className="flex flex-1 flex-col gap-3">
            {/* Lv + nickname */}
            <div className="flex items-center gap-2">
              <Skeleton variant="rect" className="h-6 w-14 rounded-full" />
              <Skeleton variant="text" className="h-5 w-2/5" />
            </div>
            {/* ProgressBar */}
            <div className="flex flex-col gap-2">
              <Skeleton variant="text" className="h-5 w-20" />
              <Skeleton variant="rect" className="h-5 w-full" />
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
