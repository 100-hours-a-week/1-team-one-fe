import { useInfiniteQuery } from '@tanstack/react-query';

import {
  type PostListInfiniteQueryOptions,
  postListInfiniteQueryOptions,
} from '@/src/entities/post';

import { MOMENTS_LIST_CONFIG } from '../config/constants';
import type { MomentsListQueryParams } from '../model/types';

type MomentsListInfiniteQueryOptions = PostListInfiniteQueryOptions;

export function usePostsInfiniteQuery(
  params: MomentsListQueryParams,
  options?: MomentsListInfiniteQueryOptions & { isLoggedIn?: boolean },
) {
  const { isLoggedIn = false, ...queryOverrides } = options ?? {};

  return useInfiniteQuery({
    ...postListInfiniteQueryOptions(params, isLoggedIn, MOMENTS_LIST_CONFIG.MAX_PAGES),
    ...queryOverrides,
  });
}
