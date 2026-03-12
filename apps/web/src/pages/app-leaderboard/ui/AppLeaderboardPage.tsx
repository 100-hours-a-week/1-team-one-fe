import { Card } from '@repo/ui/card';
import { useMemo } from 'react';

import type { LeaderboardDataType, LeaderboardRankItemType } from '@/src/entities/leaderboard';
import {
  LEADERBOARD_CONFIG,
  LEADERBOARD_MESSAGES,
  LeaderboardPodium,
  LeaderboardPodiumSkeleton,
  LeaderboardRankingPanel,
  LeaderboardRankingPanelSkeleton,
  useLeaderboardInfiniteQuery,
} from '@/src/features/leaderboard';
import { normalizeTimeString } from '@/src/shared/lib/date/normalize-time';
import { LoadableBoundary } from '@/src/shared/ui/boundary';

type LeaderboardPanelData = {
  podiumItems: ReadonlyArray<LeaderboardRankItemType>;
  listItems: ReadonlyArray<LeaderboardRankItemType>;
  myRank: LeaderboardRankItemType | null;
  lastUpdatedAt: string;
};

function buildAllRankItems(pages: ReadonlyArray<LeaderboardDataType>) {
  return pages.flatMap((page) => page.ranks);
}

//podium 제외한 랭크를 줌
function buildListItems(allRankItems: ReadonlyArray<LeaderboardRankItemType>) {
  return allRankItems.filter((item) => item.rank > 3);
}

function formatLastUpdatedAt(lastUpdatedAt: string | undefined) {
  return normalizeTimeString(
    lastUpdatedAt,
    LEADERBOARD_MESSAGES.PODIUM.LAST_UPDATED_FALLBACK,
    LEADERBOARD_CONFIG.LAST_UPDATED_AT_FORMAT,
  );
}

export function AppLeaderboardPage() {
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
  } = useLeaderboardInfiniteQuery({
    limit: LEADERBOARD_CONFIG.PAGE_LIMIT,
  });

  const firstPage = data?.pages?.[0];
  const hasData = Boolean(firstPage);
  const allRankItems = useMemo(() => buildAllRankItems(data?.pages ?? []), [data?.pages]);
  const podiumItems = firstPage?.podium ?? [];
  const listItems = useMemo(() => buildListItems(allRankItems), [allRankItems]);
  const myRank = firstPage?.myRank ?? null;
  const lastUpdatedAtLabel = formatLastUpdatedAt(firstPage?.lastUpdatedAt);

  const resolvedPanelData: LeaderboardPanelData | undefined = hasData
    ? {
        podiumItems,
        listItems,
        myRank,
        lastUpdatedAt: lastUpdatedAtLabel,
      }
    : undefined;
  const isEmpty = hasData && allRankItems.length === 0;

  return (
    <div className="flex min-h-full flex-col">
      <section className="flex flex-1 flex-col px-4 pb-6">
        <LoadableBoundary
          isLoading={isLoading}
          error={error}
          data={resolvedPanelData}
          isEmpty={isEmpty}
          renderLoading={() => (
            <div className="flex flex-col gap-3 py-4">
              <div className="bg-bg sticky top-0 z-(--z-sticky) pb-1">
                <LeaderboardPodiumSkeleton />
              </div>
              <LeaderboardRankingPanelSkeleton />
            </div>
          )}
          renderError={() => (
            <div className="py-4">
              <Card padding="md" variant="elevated" className="bg-error-50 shadow-none">
                <p className="text-error-600 text-sm">{LEADERBOARD_MESSAGES.PANEL.ERROR}</p>
              </Card>
            </div>
          )}
          renderEmpty={() => (
            <div className="py-4">
              <Card padding="md" variant="elevated" className="bg-bg-subtle shadow-none">
                <p className="text-text-muted text-sm">{LEADERBOARD_MESSAGES.PANEL.EMPTY}</p>
              </Card>
            </div>
          )}
        >
          {(resolvedData) => (
            <div className="flex flex-col gap-3 py-4">
              <div className="bg-bg sticky top-0 z-(--z-sticky) pb-1">
                <LeaderboardPodium items={resolvedData.podiumItems} />
                <div className="px-1 pt-2 pb-1">
                  <div className="flex items-start gap-1">
                    <span
                      aria-hidden="true"
                      className="bg-brand-500 mt-1 inline-flex h-1.5 w-1.5 rounded-full"
                    />
                    <p className="text-text-muted text-left text-xs font-medium">
                      {LEADERBOARD_MESSAGES.PODIUM.RANK_RULE}
                    </p>
                  </div>
                  <p className="text-text-muted mt-1 text-left text-xs font-medium">
                    <span className="text-brand-700">
                      {LEADERBOARD_MESSAGES.PODIUM.LAST_UPDATED_PREFIX}
                    </span>{' '}
                    {resolvedData.lastUpdatedAt}
                  </p>
                </div>
              </div>
              <LeaderboardRankingPanel
                rankItems={resolvedData.listItems}
                myRank={resolvedData.myRank}
                totalCount={allRankItems.length}
                hasPreviousPage={Boolean(hasPreviousPage)}
                hasNextPage={Boolean(hasNextPage)}
                isFetchingPreviousPage={isFetchingPreviousPage}
                isFetchingNextPage={isFetchingNextPage}
                onFetchPrevious={() => void fetchPreviousPage()}
                onFetchNext={() => void fetchNextPage()}
              />
            </div>
          )}
        </LoadableBoundary>
      </section>
    </div>
  );
}
