import {
  type InfiniteData,
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import {
  fetchPostListMetaFn,
  fetchPostListPageFn,
  type PostListResponseDataType,
} from '@/src/entities/post';
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
  options?: MomentsListInfiniteQueryOptions & { isLoggedIn?: boolean },
) {
  const { isLoggedIn, ...queryOptions } = options ?? {};

  return useInfiniteQuery({
    queryKey: MOMENTS_LIST_QUERY_KEYS.list(params, isLoggedIn),
    queryFn: async ({ pageParam }) => {
      const cursor = pageParam ?? undefined;
      const baseParams = {
        limit: params.limit,
        authorId: params.authorId,
        tags: params.tags,
        cursor,
      };

      if (!isLoggedIn) return fetchPostListPageFn(baseParams);

      const [mainResult, metaResult] = await Promise.allSettled([
        fetchPostListPageFn(baseParams),
        fetchPostListMetaFn(baseParams),
      ]);

      if (mainResult.status === 'rejected') throw mainResult.reason;
      const mainData = mainResult.value;

      if (metaResult.status === 'rejected' || !metaResult.value) return mainData;

      const metaMap = new Map(metaResult.value.posts.map((m) => [m.postId, m]));
      return {
        ...mainData,
        posts: mainData.posts.map((post) => {
          const meta = metaMap.get(post.postId);
          return meta ? { ...post, ...meta } : post;
        }),
      };
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.paging?.hasNext) return undefined;
      return lastPage.paging.nextCursor ?? undefined;
    },
    ...queryOptions,
  });
}
