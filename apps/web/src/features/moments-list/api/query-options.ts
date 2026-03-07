import {
  type InfiniteData,
  infiniteQueryOptions,
  queryOptions,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import {
  fetchPostListMetaFn,
  fetchPostListPageFn,
  type PostListResponseDataType,
} from '@/src/entities/post';
import { type ApiError } from '@/src/shared/api';

import { MOMENTS_LIST_CONFIG } from '../config/constants';
import { MOMENTS_LIST_QUERY_KEYS } from '../config/query-keys';
import type { MomentsListQueryParams } from '../model/types';

export type MomentsListInfiniteQueryKey = ReturnType<typeof MOMENTS_LIST_QUERY_KEYS.list>;
export type MomentsListRootQueryKey = ReturnType<typeof MOMENTS_LIST_QUERY_KEYS.root>;

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

export function momentsListRootQueryOptions() {
  return queryOptions<unknown, ApiError, unknown, MomentsListRootQueryKey>({
    queryKey: MOMENTS_LIST_QUERY_KEYS.root(),
  });
}

async function fetchMomentsListPage(
  params: MomentsListQueryParams,
  isLoggedIn: boolean,
  pageParam: string | null,
): Promise<PostListResponseDataType> {
  const cursor = pageParam ?? undefined;
  const baseParams = {
    limit: params.limit,
    authorId: params.authorId,
    tags: params.tags,
    cursor,
  };

  if (!isLoggedIn) {
    return fetchPostListPageFn(baseParams);
  }

  const [mainResult, metaResult] = await Promise.allSettled([
    fetchPostListPageFn(baseParams),
    fetchPostListMetaFn(baseParams),
  ]);

  if (mainResult.status === 'rejected') {
    throw mainResult.reason;
  }
  const mainData = mainResult.value;

  if (metaResult.status === 'rejected' || !metaResult.value) {
    return mainData;
  }

  const metaMap = new Map(metaResult.value.posts.map((meta) => [meta.postId, meta]));
  return {
    ...mainData,
    posts: mainData.posts.map((post) => {
      const meta = metaMap.get(post.postId);
      if (!meta) {
        return post;
      }

      return { ...post, ...meta };
    }),
  };
}

export function momentsListInfiniteQueryOptions(
  params: MomentsListQueryParams,
  isLoggedIn = false,
) {
  return infiniteQueryOptions<
    PostListResponseDataType,
    ApiError,
    InfiniteData<PostListResponseDataType>,
    MomentsListInfiniteQueryKey,
    string | null
  >({
    queryKey: MOMENTS_LIST_QUERY_KEYS.list(params, isLoggedIn),
    queryFn: ({ pageParam }) => fetchMomentsListPage(params, isLoggedIn, pageParam),
    maxPages: MOMENTS_LIST_CONFIG.MAX_PAGES,
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.paging?.hasNext) {
        return undefined;
      }

      return lastPage.paging.nextCursor ?? undefined;
    },
  });
}
