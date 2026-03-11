import { Avatar } from '@repo/ui/avatar';
import { cn } from '@repo/ui/lib/utils';

import type { LeaderboardRankItemType } from '@/src/entities/leaderboard';

import { LEADERBOARD_MESSAGES } from '../config/messages';

type LeaderboardRankRowProps = {
  item: LeaderboardRankItemType;
  isMyRank: boolean;
  totalCount: number;
};

function getPercentileLabel(rank: number, totalCount: number) {
  if (totalCount <= 0) {
    return null;
  }

  const percentile = Math.max(1, Math.min(100, Math.ceil((rank / totalCount) * 100)));

  return `${LEADERBOARD_MESSAGES.ROW.PERCENTILE_PREFIX} ${percentile}%`;
}

export function LeaderboardRankItem({ item, isMyRank, totalCount }: LeaderboardRankRowProps) {
  const scoreLabel = item.exp.toLocaleString('ko-KR');
  const rankBadgeLabel = `${item.rank}${LEADERBOARD_MESSAGES.ROW.RANK_SUFFIX}`;
  const subtitleLabel = isMyRank ? LEADERBOARD_MESSAGES.ROW.MY_BADGE : item.nickname;
  const percentileLabel = isMyRank ? getPercentileLabel(item.rank, totalCount) : null;

  return (
    <div
      className={cn(
        'duration-base relative flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 transition-[background-color,box-shadow]',
        isMyRank
          ? 'bg-surface-elevated shadow-lg'
          : 'hover:bg-bg-subtle bg-transparent hover:shadow-sm',
      )}
    >
      <div className="relative shrink-0">
        <Avatar
          src={item.profileImageUrl}
          name={item.nickname}
          alt={`${item.nickname} ${LEADERBOARD_MESSAGES.PODIUM.AVATAR_ALT_SUFFIX}`}
          size="sm"
          shape="squircle"
          className="bg-bg-subtle h-11 w-11"
        />
        <span
          className="bg-error-500 absolute -top-1.5 -left-1.5 inline-flex min-h-5 min-w-8 items-center justify-center rounded-md px-1 text-[10px] leading-none font-bold text-white"
          aria-label={rankBadgeLabel}
        >
          {rankBadgeLabel}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-text-subtle truncate text-xs leading-none">{subtitleLabel}</p>
        <p className="text-text mt-0.5 truncate text-[1.75rem] leading-none font-semibold tracking-tight">
          {scoreLabel}
          <span className="text-text-muted ml-0.5 text-sm font-medium">
            {LEADERBOARD_MESSAGES.ROW.SCORE_SUFFIX}
          </span>
        </p>
      </div>

      {percentileLabel ? (
        <span className="bg-warning-100 text-warning-700 inline-flex shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold">
          {percentileLabel}
        </span>
      ) : null}
    </div>
  );
}
