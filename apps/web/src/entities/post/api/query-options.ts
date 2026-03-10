import {
  type InfiniteData,
  infiniteQueryOptions,
  queryOptions,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import type { ApiError } from '@/src/shared/api';

import { POST_QUERY_KEYS, type PostListQueryParams } from '../config/query-keys';
import type { PostDetailDataType } from './dto/post-detail.dto';
import type { PostListResponseDataType } from './dto/post-list.dto';
import type { PostMetaDataType } from './dto/post-meta.dto';
import { fetchPostDetailFn } from './post-detail';
import { fetchPostListPageFn } from './post-list';
import { fetchPostListMetaFn, fetchPostMetaFn } from './post-meta';

const DEFAULT_MAX_PAGES = 10;

export type PostDetailQueryKey = ReturnType<typeof POST_QUERY_KEYS.detail>;
export type PostDetailMetaQueryKey = ReturnType<typeof POST_QUERY_KEYS.meta>;
export type PostListInfiniteQueryKey = ReturnType<typeof POST_QUERY_KEYS.list>;
export type PostListRootQueryKey = ReturnType<typeof POST_QUERY_KEYS.listRoot>;

export type PostListInfiniteQueryOptions = Omit<
  UseInfiniteQueryOptions<
    PostListResponseDataType,
    ApiError,
    InfiniteData<PostListResponseDataType>,
    PostListInfiniteQueryKey,
    string | null
  >,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
>;

export function postDetailQueryOptions(postId: number) {
  return queryOptions<PostDetailDataType, ApiError, PostDetailDataType, PostDetailQueryKey>({
    queryKey: POST_QUERY_KEYS.detail(postId),
    queryFn: () => fetchPostDetailFn(postId),
  });
}

export function postDetailMetaQueryOptions(postId: number) {
  return queryOptions<
    PostMetaDataType | null,
    ApiError,
    PostMetaDataType | null,
    PostDetailMetaQueryKey
  >({
    queryKey: POST_QUERY_KEYS.meta(postId),
    queryFn: () => fetchPostMetaFn(postId),
    throwOnError: false,
    retry: false,
  });
}

export function postListRootQueryOptions() {
  return queryOptions<unknown, ApiError, unknown, PostListRootQueryKey>({
    queryKey: POST_QUERY_KEYS.listRoot(),
  });
}

async function fetchPostListWithMeta(
  params: PostListQueryParams,
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

export function postListInfiniteQueryOptions(
  params: PostListQueryParams,
  isLoggedIn = false,
  maxPages = DEFAULT_MAX_PAGES,
) {
  return infiniteQueryOptions<
    PostListResponseDataType,
    ApiError,
    InfiniteData<PostListResponseDataType>,
    PostListInfiniteQueryKey,
    string | null
  >({
    queryKey: POST_QUERY_KEYS.list(params, isLoggedIn),
    queryFn: ({ pageParam }) => fetchPostListWithMeta(params, isLoggedIn, pageParam),
    maxPages,
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.paging?.hasNext) {
        return undefined;
      }

      return lastPage.paging.nextCursor ?? undefined;
    },
  });
}
