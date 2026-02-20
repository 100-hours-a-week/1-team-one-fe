import {
  type InfiniteData,
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import { fetchPostListPageFn, type PostListResponseDataType } from '@/src/entities/post';
import { type ApiError } from '@/src/shared/api';

import { MOMENTS_LIST_QUERY_KEYS } from '../config/query-keys';
import type { MomentsListQueryParams } from '../model/types';

export type MomentsListInfiniteQueryKey = ReturnType<typeof MOMENTS_LIST_QUERY_KEYS.list>;

export type MomentsListInfiniteQueryOptions = Omit<
  UseInfiniteQueryOptions<
    PostListResponseDataType,
    ApiError,
    InfiniteData<PostListResponseDataType>,
    MomentsListInfiniteQueryKey,
    string | null
  >,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
>;

export function usePostsInfiniteQuery(
  params: MomentsListQueryParams,
  options?: MomentsListInfiniteQueryOptions,
) {
  return useInfiniteQuery({
    queryKey: MOMENTS_LIST_QUERY_KEYS.list(params),
    queryFn: ({ pageParam }) =>
      fetchPostListPageFn({
        limit: params.limit,
        authorId: params.authorId,
        tags: params.tags,
        cursor: pageParam,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.paging?.hasNext) return undefined;
      return lastPage.paging.nextCursor ?? undefined;
    },
    ...options,
  });
}
