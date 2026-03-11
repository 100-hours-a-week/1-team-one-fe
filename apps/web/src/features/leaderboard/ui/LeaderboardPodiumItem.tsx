import { Avatar } from '@repo/ui/avatar';
import { Card } from '@repo/ui/card';
import { cn } from '@repo/ui/lib/utils';

import type { LeaderboardRankItemType } from '@/src/entities/leaderboard';

import type { LeaderboardPodiumRankType } from '../config/constants';
import { LEADERBOARD_MESSAGES } from '../config/messages';

type LeaderboardPodiumItemProps = {
  rank: LeaderboardPodiumRankType;
  item: LeaderboardRankItemType;
};

export function LeaderboardPodiumItem({ rank, item }: LeaderboardPodiumItemProps) {
  const expLabel = item.exp.toLocaleString('ko-KR');
  const rankLabel = `${rank}${LEADERBOARD_MESSAGES.PODIUM.RANK_SUFFIX}`;

  return (
    <Card
      padding="none"
      variant="elevated"
      className={cn(
        'min-h-40 rounded-2xl px-3 py-3 shadow-sm',
        rank === 1 ? 'pt-4 pb-4' : 'pt-3 pb-3',
      )}
    >
      <Avatar
        src={item.profileImageUrl}
        name={item.nickname}
        alt={`${item.nickname} ${LEADERBOARD_MESSAGES.PODIUM.AVATAR_ALT_SUFFIX}`}
        size="sm"
        shape="squircle"
        className="bg-bg-subtle h-11 w-11"
      />

      <p className="text-text-subtle mt-2 truncate text-xs">{rankLabel}</p>
      <p className="text-text mt-0.5 truncate text-sm font-medium">{item.nickname}</p>
      <p className="text-text mt-1 truncate text-[1.95rem] leading-none font-semibold tracking-tight">
        {expLabel}
        <span className="text-text-muted ml-0.5 text-base font-medium">
          {LEADERBOARD_MESSAGES.ROW.SCORE_SUFFIX}
        </span>
      </p>
    </Card>
  );
}
