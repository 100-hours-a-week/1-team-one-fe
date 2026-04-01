import { Avatar } from '@repo/ui/avatar';
import { Card } from '@repo/ui/card';
import { cn } from '@repo/ui/lib/utils';

import type { LeaderboardRankItemType } from '@/src/entities/leaderboard';
import { buildImageUrl } from '@/src/shared/lib/image';
import { OptimizedImage } from '@/src/shared/ui/optimized-image';

import { LEADERBOARD_ASSET_PATHS, type LeaderboardPodiumRankType } from '../config/constants';
import { LEADERBOARD_MESSAGES } from '../config/messages';

type LeaderboardPodiumItemProps = {
  rank: LeaderboardPodiumRankType;
  item: LeaderboardRankItemType;
};

export function LeaderboardPodiumItem({ rank, item }: LeaderboardPodiumItemProps) {
  const expLabel = item.exp.toLocaleString('ko-KR');
  const rankLabel = `${rank}${LEADERBOARD_MESSAGES.PODIUM.RANK_SUFFIX}`;
  const isChampion = rank === 1;
  const profileImageUrl = buildImageUrl(item.profileImageUrl);

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
        src={profileImageUrl}
        name={item.nickname}
        alt={`${item.nickname} ${LEADERBOARD_MESSAGES.PODIUM.AVATAR_ALT_SUFFIX}`}
        size="sm"
        shape="squircle"
        className="bg-bg-subtle h-11 w-11"
      />

      <p className="text-text-subtle mt-2 truncate text-xs">{rankLabel}</p>
      <div className="mt-0.5 flex items-center gap-1">
        <p className="text-text min-w-0 truncate text-sm font-medium">{item.nickname}</p>
        {isChampion ? (
          <OptimizedImage
            src={LEADERBOARD_ASSET_PATHS.CHAMPION_CROWN}
            alt={LEADERBOARD_MESSAGES.PODIUM.CHAMPION_CROWN_ALT}
            width={16}
            height={16}
            className="h-4 w-4 shrink-0"
          />
        ) : null}
      </div>
      <p className="text-text mt-1 truncate text-[1.95rem] leading-none font-semibold tracking-tight">
        {expLabel}
        <span className="text-text-muted ml-0.5 text-base font-medium">
          {LEADERBOARD_MESSAGES.ROW.SCORE_SUFFIX}
        </span>
      </p>
    </Card>
  );
}
