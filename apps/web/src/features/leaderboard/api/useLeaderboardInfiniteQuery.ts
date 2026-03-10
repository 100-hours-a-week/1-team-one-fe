import { useInfiniteQuery } from '@tanstack/react-query';

import {
  type LeaderboardInfiniteQueryOptions,
  leaderboardInfiniteQueryOptions,
  type LeaderboardListQueryParamsType,
} from '@/src/entities/leaderboard';

export type UseLeaderboardInfiniteQueryOptions = LeaderboardInfiniteQueryOptions;

export function useLeaderboardInfiniteQuery(
  params: LeaderboardListQueryParamsType = {},
  options?: UseLeaderboardInfiniteQueryOptions,
) {
  return useInfiniteQuery({
    ...leaderboardInfiniteQueryOptions(params),
    ...options,
  });
}
