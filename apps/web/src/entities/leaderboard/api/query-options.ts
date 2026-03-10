import {
  type InfiniteData,
  infiniteQueryOptions,
  queryOptions,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import type { ApiError } from '@/src/shared/api';

import { LEADERBOARD_QUERY_KEYS } from '../config/query-keys';
import type { LeaderboardDataType, LeaderboardListQueryParamsType } from '../model/types';
import { fetchUsersRankFn } from './users-rank-get';

const LEADERBOARD_DEFAULT_LIMIT = 20;

function resolveLeaderboardLimit(limit?: number) {
  if (typeof limit !== 'number') {
    return LEADERBOARD_DEFAULT_LIMIT;
  }

  return limit;
}

export type LeaderboardListInfiniteQueryKey = ReturnType<typeof LEADERBOARD_QUERY_KEYS.list>;
export type LeaderboardListRootQueryKey = ReturnType<typeof LEADERBOARD_QUERY_KEYS.listRoot>;

export type LeaderboardInfiniteQueryOptions = Omit<
  UseInfiniteQueryOptions<
    LeaderboardDataType,
    ApiError,
    InfiniteData<LeaderboardDataType>,
    LeaderboardListInfiniteQueryKey,
    string | null
  >,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
>;

export function leaderboardListRootQueryOptions() {
  return queryOptions<unknown, ApiError, unknown, LeaderboardListRootQueryKey>({
    queryKey: LEADERBOARD_QUERY_KEYS.listRoot(),
  });
}

export function leaderboardInfiniteQueryOptions(params: LeaderboardListQueryParamsType = {}) {
  const limit = resolveLeaderboardLimit(params.limit);

  return infiniteQueryOptions<
    LeaderboardDataType,
    ApiError,
    InfiniteData<LeaderboardDataType>,
    LeaderboardListInfiniteQueryKey,
    string | null
  >({
    queryKey: LEADERBOARD_QUERY_KEYS.list(limit),
    queryFn: ({ pageParam }) =>
      fetchUsersRankFn({
        limit,
        cursor: pageParam ?? undefined,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage.paging.hasNext) {
        return undefined;
      }

      return lastPage.paging.nextCursor ?? undefined;
    },
  });
}
