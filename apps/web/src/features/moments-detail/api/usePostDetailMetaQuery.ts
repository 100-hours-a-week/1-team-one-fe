import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { fetchPostMetaFn, type PostMetaDataType } from '@/src/entities/post';
import { type ApiError } from '@/src/shared/api';

import { MOMENTS_DETAIL_QUERY_KEYS } from '../config/query-keys';

export type PostDetailMetaQueryKey = ReturnType<typeof MOMENTS_DETAIL_QUERY_KEYS.meta>;

export type PostDetailMetaQueryOptions = Omit<
  UseQueryOptions<
    PostMetaDataType | null,
    ApiError,
    PostMetaDataType | null,
    PostDetailMetaQueryKey
  >,
  'queryKey' | 'queryFn'
>;

export function usePostDetailMetaQuery(postId: number, options?: PostDetailMetaQueryOptions) {
  return useQuery({
    queryKey: MOMENTS_DETAIL_QUERY_KEYS.meta(postId),
    queryFn: () => fetchPostMetaFn(postId),
    throwOnError: false,
    retry: false,
    ...options,
  });
}
