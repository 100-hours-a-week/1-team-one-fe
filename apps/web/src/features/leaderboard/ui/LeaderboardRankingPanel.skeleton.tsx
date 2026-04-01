import { cn } from '@repo/ui/lib/utils';
import { Skeleton } from '@repo/ui/skeleton';

const LEADERBOARD_ROW_SKELETON_COUNT = 7;
const MY_RANK_SKELETON_INDEX = 3;

type LeaderboardRankRowSkeletonProps = {
  isMyRank: boolean;
};

function LeaderboardRankItemSkeleton({ isMyRank }: LeaderboardRankRowSkeletonProps) {
  return (
    <div
      className={cn(
        'relative flex items-center gap-2.5 rounded-xl px-2.5 py-2.5',
        isMyRank ? 'bg-surface-elevated shadow-lg' : 'bg-transparent',
      )}
    >
      <div className="relative shrink-0">
        <Skeleton className="h-11 w-11 rounded-xl" />
        <Skeleton className="absolute -top-1.5 -left-1.5 h-5 w-8 rounded-md" />
      </div>

      <div className="min-w-0 flex-1">
        <Skeleton className="h-3 w-20 rounded-sm" />
        <Skeleton className="mt-1 h-8 w-32 rounded-sm" />
      </div>

      {isMyRank ? <Skeleton className="h-4 w-16 rounded-md" /> : null}
    </div>
  );
}

export function LeaderboardRankingPanelSkeleton() {
  return (
    <div aria-busy="true" aria-label="leaderboard loading" className="px-4 pt-4 pb-3">
      <div className="flex flex-col gap-1">
        {Array.from({ length: LEADERBOARD_ROW_SKELETON_COUNT }).map((_, index) => (
          <LeaderboardRankItemSkeleton
            key={`leaderboard-row-skeleton-${index}`}
            isMyRank={index === MY_RANK_SKELETON_INDEX}
          />
        ))}
      </div>
    </div>
  );
}
