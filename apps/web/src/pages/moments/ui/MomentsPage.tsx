import { useMemo } from 'react';

import {
  MOMENTS_LIST_CONFIG,
  MOMENTS_LIST_MESSAGES,
  usePostsInfiniteQuery,
} from '@/src/features/moments-list';
import { useOnboardingStatusQuery } from '@/src/features/onboarding-status';
import { LoadableBoundary } from '@/src/shared/ui/boundary';
import { MomentsList } from '@/src/widgets/moments-list';

import { MomentsPageSkeleton } from './MomentsPage.skeleton';

const DEFAULT_QUERY_PARAMS = {
  limit: MOMENTS_LIST_CONFIG.PAGE_LIMIT,
} as const;

export function MomentsPage() {
  const { data: onboardingStatus } = useOnboardingStatusQuery();
  const isLoggedIn = onboardingStatus !== 'unauthorized';

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePostsInfiniteQuery(DEFAULT_QUERY_PARAMS);

  const posts = useMemo(() => data?.pages?.flatMap((page) => page.posts) ?? [], [data]);
  const isEmpty = !data && posts.length === 0;

  return (
    <LoadableBoundary
      isLoading={isLoading}
      error={error}
      data={posts}
      isEmpty={isEmpty}
      renderLoading={() => <MomentsPageSkeleton />}
      renderError={() => null}
      renderEmpty={() => (
        <div className="text-text-muted flex justify-center py-8 text-sm">
          {MOMENTS_LIST_MESSAGES.LIST.EMPTY}
        </div>
      )}
    >
      {(items) => (
        <div className="flex flex-col px-4 pt-4 pb-6">
          <MomentsList
            items={items}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={Boolean(hasNextPage)}
            onFetchNext={() => void fetchNextPage()}
            isLoggedIn={isLoggedIn}
          />
        </div>
      )}
    </LoadableBoundary>
  );
}
