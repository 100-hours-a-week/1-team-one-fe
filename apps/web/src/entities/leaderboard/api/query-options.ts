import {
  type InfiniteData,
  infiniteQueryOptions,
  queryOptions,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import type { ApiError } from '@/src/shared/api';

import { LEADERBOARD_QUERY_KEYS } from '../config/query-keys';
import type {
  LeaderboardCursorDirectionType,
  LeaderboardDataType,
  LeaderboardListQueryParamsType,
} from '../model/types';
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

export type LeaderboardInfinitePageParam = {
  cursor?: string;
  direction?: LeaderboardCursorDirectionType;
} | null;

export type LeaderboardInfiniteQueryOptions = Omit<
  UseInfiniteQueryOptions<
    LeaderboardDataType,
    ApiError,
    InfiniteData<LeaderboardDataType>,
    LeaderboardListInfiniteQueryKey,
    LeaderboardInfinitePageParam
  >,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam' | 'getPreviousPageParam'
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
    LeaderboardInfinitePageParam
  >({
    queryKey: LEADERBOARD_QUERY_KEYS.list(limit),
    queryFn: ({ pageParam }) => {
      if (!pageParam?.cursor) {
        return fetchUsersRankFn({
          limit,
        });
      }

      return fetchUsersRankFn({
        limit,
        cursor: pageParam.cursor,
        direction: pageParam.direction,
      });
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage.paging.hasNext) {
        return undefined;
      }

      const nextCursor = lastPage.paging.nextCursor;
      if (!nextCursor) {
        return undefined;
      }

      return {
        cursor: nextCursor,
        direction: 'NEXT',
      };
    },
    getPreviousPageParam: (firstPage) => {
      if (!firstPage.paging.hasPrev) {
        return undefined;
      }

      const prevCursor = firstPage.paging.prevCursor;
      if (!prevCursor) {
        return undefined;
      }

      return {
        cursor: prevCursor,
        direction: 'PREV',
      };
    },
  });
}
