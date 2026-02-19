import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { fetchPostDetailFn, type PostDetailData } from '@/src/entities/post';
import { type ApiError } from '@/src/shared/api';

import { MOMENTS_DETAIL_QUERY_KEYS } from '../config/query-keys';

export type PostDetailQueryKey = ReturnType<typeof MOMENTS_DETAIL_QUERY_KEYS.detail>;

export type PostDetailQueryOptions = Omit<
  UseQueryOptions<PostDetailData, ApiError, PostDetailData, PostDetailQueryKey>,
  'queryKey' | 'queryFn'
>;

export function usePostDetailQuery(postId: number, options?: PostDetailQueryOptions) {
  return useQuery({
    queryKey: MOMENTS_DETAIL_QUERY_KEYS.detail(postId),
    queryFn: () => fetchPostDetailFn(postId),
    ...options,
  });
}
