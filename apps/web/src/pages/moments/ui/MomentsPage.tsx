import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

import {
  MOMENTS_LIST_CONFIG,
  MOMENTS_LIST_MESSAGES,
  type MomentsListQueryParams,
  useMomentsFeedQuery,
} from '@/src/features/moments-list';
import { useOnboardingStatusQuery } from '@/src/features/onboarding-status';
import { normalizeStringList } from '@/src/shared/lib/list';
import { ROUTES } from '@/src/shared/routes';
import { LoadableBoundary } from '@/src/shared/ui/boundary';
import { useSetHeaderAction } from '@/src/widgets/layout/header-action-context';
import { LoginButton } from '@/src/widgets/login-button';
import { MomentsCreateFab } from '@/src/widgets/moments-create-fab';
import { MomentsList } from '@/src/widgets/moments-list';
import { MomentsTagSearch } from '@/src/widgets/moments-tag-search';

import type { MomentsPageProps } from '../model/get-moments-page-server-side-props';
import { MomentsPageSkeleton } from './MomentsPage.skeleton';

const DEFAULT_QUERY_PARAMS: MomentsListQueryParams = {
  limit: MOMENTS_LIST_CONFIG.PAGE_LIMIT,
} as const;

export function MomentsPage({ initialPageData, initialListParams }: MomentsPageProps) {
  const router = useRouter();
  const { data: onboardingStatus } = useOnboardingStatusQuery();
  const isLoggedIn = onboardingStatus !== 'unauthorized';

  const searchTags = useMemo(() => normalizeStringList(router.query.tag), [router.query.tag]);

  const listParams = useMemo(
    () => ({
      ...DEFAULT_QUERY_PARAMS,
      tags: searchTags.length > 0 ? [...searchTags] : undefined,
    }),
    [searchTags],
  );

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMomentsFeedQuery(listParams, {
      isLoggedIn,
      initialPageData,
      initialListParams,
    });

  const posts = useMemo(() => data?.pages?.flatMap((page) => page.posts) ?? [], [data]);
  const isEmpty = !isLoading && posts.length === 0;
  const isSearching = searchTags.length > 0;

  const handleSearch = useCallback(
    (tags: ReadonlyArray<string>) => {
      const normalizedTags = normalizeStringList(tags);
      const nextQuery = { ...router.query };

      if ('tag' in nextQuery) {
        delete nextQuery.tag;
      }
      if (normalizedTags.length > 0) {
        nextQuery.tag = normalizedTags;
      }

      router.replace({ pathname: router.pathname, query: nextQuery }, undefined, {
        shallow: true,
      });
    },
    [router],
  );

  const handleLoginRequired = useCallback(() => {
    void router.push(ROUTES.LOGIN);
  }, [router]);

  useSetHeaderAction(() => {
    if (isLoggedIn) return null;
    return <LoginButton />;
  }, [isLoggedIn]);

  return (
    <>
      <div className="flex flex-col gap-4 px-4 pt-4 pb-6">
        <div className="bg-bg sticky top-0" style={{ zIndex: 'var(--z-sticky)' }}>
          <MomentsTagSearch defaultTags={searchTags} onSearch={handleSearch} />
        </div>
        <LoadableBoundary
          isLoading={isLoading}
          error={error}
          data={posts}
          isEmpty={isEmpty}
          renderLoading={() => <MomentsPageSkeleton />}
          renderError={() => null}
          renderEmpty={() => (
            <div className="text-text-muted flex flex-col items-center gap-1 py-10 text-sm">
              <span>
                {isSearching
                  ? MOMENTS_LIST_MESSAGES.LIST.EMPTY_SEARCH
                  : MOMENTS_LIST_MESSAGES.LIST.EMPTY}
              </span>
              {isSearching ? (
                <span className="text-text-subtle">
                  {MOMENTS_LIST_MESSAGES.LIST.EMPTY_SEARCH_HELPER}
                </span>
              ) : null}
            </div>
          )}
        >
          {(items) => (
            <MomentsList
              items={items}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={Boolean(hasNextPage)}
              onFetchNext={() => void fetchNextPage()}
              isLoggedIn={isLoggedIn}
            />
          )}
        </LoadableBoundary>
      </div>

      <MomentsCreateFab isLoggedIn={isLoggedIn} onLoginRequired={handleLoginRequired} />
    </>
  );
}
