import { SkeletonCard } from '@repo/ui/skeleton-card';
import { Spinner } from '@repo/ui/spinner';

import type { LeaderboardRankItemType } from '@/src/entities/leaderboard';
import { InfiniteScrollTrigger } from '@/src/shared/ui/infinite-scroll-trigger';

import { LEADERBOARD_CONFIG } from '../config/constants';
import { LEADERBOARD_MESSAGES } from '../config/messages';
import { useCenterMyRankOnFirstRender } from '../model/useCenterMyRankOnFirstRender';
import { usePreserveScrollOnPrepend } from '../model/usePreserveScrollOnPrepend';
import { LeaderboardRankItem } from './LeaderboardRankPanelItem';

type LeaderboardRankingPanelProps = {
  rankItems: ReadonlyArray<LeaderboardRankItemType>;
  myRank: LeaderboardRankItemType | null;
  totalCount: number;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onFetchPrevious: () => void;
  onFetchNext: () => void;
};

export function LeaderboardRankingPanel({
  rankItems,
  myRank,
  totalCount,
  isFetchingNextPage,
  isFetchingPreviousPage,
  hasPreviousPage,
  hasNextPage,
  onFetchPrevious,
  onFetchNext,
}: LeaderboardRankingPanelProps) {
  const myRankUserId = myRank?.userId ?? null;
  const myRankPosition = myRank?.rank ?? null;
  const hasRows = rankItems.length > 0;
  //내 순위 중앙으로 배치하는 스크롤 로직
  const { panelRef, isCenteringMyRank } = useCenterMyRankOnFirstRender({
    hasRows,
    myRankPosition,
    myRankUserId,
  });
  const { captureSnapshotBeforePrepend, isRestoringPrependScroll } = usePreserveScrollOnPrepend({
    panelRef,
    isFetchingPreviousPage,
    itemsLength: rankItems.length,
  });

  //true 일 시 observer 를 막아 중복 fetch 방지
  const isObserverBlocked = isCenteringMyRank || isRestoringPrependScroll;

  const handleFetchPrevious = () => {
    captureSnapshotBeforePrepend();
    onFetchPrevious();
  };

  return (
    <div ref={panelRef} className="px-4 pt-4 pb-3">
      <InfiniteScrollTrigger
        isActive={
          Boolean(hasPreviousPage) &&
          !isFetchingPreviousPage &&
          !isFetchingNextPage &&
          !isObserverBlocked
        }
        onIntersect={handleFetchPrevious}
        rootMargin={LEADERBOARD_CONFIG.INFINITE_SCROLL_PREVIOUS_ROOT_MARGIN}
        className="h-3"
      />

      {isFetchingPreviousPage ? <SkeletonCard /> : null}

      {!hasRows ? (
        <p className="text-text-muted bg-bg-subtle rounded-xl px-3 py-8 text-center text-sm">
          {LEADERBOARD_MESSAGES.PANEL.EMPTY}
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {rankItems.map((item) => (
            <LeaderboardRankItem
              key={`leaderboard-row-${item.userId}-${item.rank}`}
              item={item}
              isMyRank={item.userId === myRankUserId}
              totalCount={totalCount}
            />
          ))}
        </div>
      )}

      {isFetchingNextPage ? <Spinner size="sm" /> : null}

      <InfiniteScrollTrigger
        isActive={
          Boolean(hasNextPage) &&
          !isFetchingNextPage &&
          !isFetchingPreviousPage &&
          !isObserverBlocked
        }
        onIntersect={onFetchNext}
        rootMargin={LEADERBOARD_CONFIG.INFINITE_SCROLL_NEXT_ROOT_MARGIN}
        className="h-3"
      />
    </div>
  );
}
