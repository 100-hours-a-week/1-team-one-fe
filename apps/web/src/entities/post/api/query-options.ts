import {
  type InfiniteData,
  infiniteQueryOptions,
  queryOptions,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import type { ApiError } from '@/src/shared/api';

import {
  POST_QUERY_KEYS,
  type PostListPageQueryParams,
  type PostListQueryParams,
} from '../config/query-keys';
import type { PostDetailDataType } from './dto/post-detail.dto';
import type { PostListResponseDataType } from './dto/post-list.dto';
import type { PostListMetaDataType, PostMetaDataType } from './dto/post-meta.dto';
import { fetchPostDetailFn } from './post-detail';
import { fetchPublicPostListPageFn } from './post-list';
import { fetchPostListMetaFn, fetchPostMetaFn } from './post-meta';

const DEFAULT_MAX_PAGES = 10;

export type PostDetailQueryKey = ReturnType<typeof POST_QUERY_KEYS.detail>;
export type PostDetailMetaQueryKey = ReturnType<typeof POST_QUERY_KEYS.meta>;
export type PostListInfiniteQueryKey = ReturnType<typeof POST_QUERY_KEYS.list>;
export type PostListRootQueryKey = ReturnType<typeof POST_QUERY_KEYS.listRoot>;
export type PostListMetaPageQueryKey = ReturnType<typeof POST_QUERY_KEYS.listMetaPage>;
export type PostListMetaPageRootQueryKey = ReturnType<typeof POST_QUERY_KEYS.listMetaPageRoot>;

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

export function postListMetaPageRootQueryOptions() {
  return queryOptions<unknown, ApiError, unknown, PostListMetaPageRootQueryKey>({
    queryKey: POST_QUERY_KEYS.listMetaPageRoot(),
  });
}

export function postListMetaPageQueryOptions(params: PostListPageQueryParams) {
  return queryOptions<
    PostListMetaDataType | null,
    ApiError,
    PostListMetaDataType | null,
    PostListMetaPageQueryKey
  >({
    queryKey: POST_QUERY_KEYS.listMetaPage(params),
    queryFn: () => fetchPostListMetaFn(params),
    throwOnError: false,
    retry: false,
  });
}

export function postListInfiniteQueryOptions(
  params: PostListQueryParams,
  maxPages = DEFAULT_MAX_PAGES,
) {
  return infiniteQueryOptions<
    PostListResponseDataType,
    ApiError,
    InfiniteData<PostListResponseDataType>,
    PostListInfiniteQueryKey,
    string | null
  >({
    queryKey: POST_QUERY_KEYS.list(params),
    queryFn: ({ pageParam }) =>
      fetchPublicPostListPageFn({
        limit: params.limit,
        authorId: params.authorId,
        tags: params.tags,
        cursor: pageParam ?? undefined,
      }),
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
