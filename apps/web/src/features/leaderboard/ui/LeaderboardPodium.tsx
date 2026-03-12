import { cn } from '@repo/ui/lib/utils';

import type { LeaderboardRankItemType } from '@/src/entities/leaderboard';

import {
  LEADERBOARD_PODIUM_LAYOUT_ORDER,
  type LeaderboardPodiumRankType,
} from '../config/constants';
import { LeaderboardPodiumItem } from './LeaderboardPodiumItem';

type LeaderboardPodiumProps = {
  items: ReadonlyArray<LeaderboardRankItemType>;
};

function EmptyPodiumSlot({ rank }: { rank: LeaderboardPodiumRankType }) {
  return (
    <div className="bg-surface flex min-h-40 flex-col items-center justify-center rounded-2xl">
      <span className="text-text-muted text-xs font-semibold">#{rank}</span>
    </div>
  );
}

export function LeaderboardPodium({ items }: LeaderboardPodiumProps) {
  const podiumMap = new Map(items.map((item) => [item.rank, item] as const));

  return (
    <section className="grid grid-cols-3 items-end gap-2.5">
      {LEADERBOARD_PODIUM_LAYOUT_ORDER.map((rank) => {
        const item = podiumMap.get(rank);
        const isChampion = rank === 1;

        return (
          <div
            key={rank}
            className={cn('duration-base transition-transform', isChampion && '-translate-y-2')}
          >
            {item ? (
              <LeaderboardPodiumItem rank={rank} item={item} />
            ) : (
              <EmptyPodiumSlot rank={rank} />
            )}
          </div>
        );
      })}
    </section>
  );
}
