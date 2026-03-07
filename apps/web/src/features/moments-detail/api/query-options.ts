import { queryOptions } from '@tanstack/react-query';

import {
  fetchPostDetailFn,
  fetchPostMetaFn,
  type PostDetailDataType,
  type PostMetaDataType,
} from '@/src/entities/post';
import { type ApiError } from '@/src/shared/api';

import { MOMENTS_DETAIL_QUERY_KEYS } from '../config/query-keys';

export type PostDetailQueryKey = ReturnType<typeof MOMENTS_DETAIL_QUERY_KEYS.detail>;
export type PostDetailMetaQueryKey = ReturnType<typeof MOMENTS_DETAIL_QUERY_KEYS.meta>;

export function postDetailQueryOptions(postId: number) {
  return queryOptions<PostDetailDataType, ApiError, PostDetailDataType, PostDetailQueryKey>({
    queryKey: MOMENTS_DETAIL_QUERY_KEYS.detail(postId),
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
    queryKey: MOMENTS_DETAIL_QUERY_KEYS.meta(postId),
    queryFn: () => fetchPostMetaFn(postId),
    throwOnError: false,
    retry: false,
  });
}
