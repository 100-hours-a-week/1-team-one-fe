import { cn } from '@repo/ui/lib/utils';
import { Skeleton } from '@repo/ui/skeleton';
import { SkeletonAvatar } from '@repo/ui/skeleton-avatar';
import { SkeletonText } from '@repo/ui/skeleton-text';

import { LEADERBOARD_PODIUM_LAYOUT_ORDER } from '../config/constants';

export function LeaderboardPodiumSkeleton() {
  return (
    <section
      className="grid grid-cols-3 items-end gap-2.5"
      aria-busy="true"
      aria-label="leaderboard podium loading"
    >
      {LEADERBOARD_PODIUM_LAYOUT_ORDER.map((rank) => (
        <div
          key={rank}
          className={cn('duration-base transition-transform', rank === 1 && '-translate-y-2')}
        >
          <div className="bg-surface relative flex min-h-40 flex-col gap-2 overflow-hidden rounded-2xl px-3 py-3">
            <Skeleton className="absolute inset-0 opacity-60" />
            <div className="relative">
              <SkeletonAvatar size="sm" className="h-11 w-11" />
              <SkeletonText
                lines={3}
                widths={['28px', '56px', '84px']}
                className="mt-2 w-full max-w-23"
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
