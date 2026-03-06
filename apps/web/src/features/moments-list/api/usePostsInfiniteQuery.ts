import { useInfiniteQuery } from '@tanstack/react-query';

import type { MomentsListQueryParams } from '../model/types';
import {
  type MomentsListInfiniteQueryOptions,
  momentsListInfiniteQueryOptions,
} from './query-options';

export function usePostsInfiniteQuery(
  params: MomentsListQueryParams,
  options?: MomentsListInfiniteQueryOptions & { isLoggedIn?: boolean },
) {
  const { isLoggedIn = false, ...queryOverrides } = options ?? {};

  return useInfiniteQuery({
    ...momentsListInfiniteQueryOptions(params, isLoggedIn),
    ...queryOverrides,
  });
}
