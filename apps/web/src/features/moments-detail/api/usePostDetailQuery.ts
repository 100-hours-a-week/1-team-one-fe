import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type PostDetailDataType } from '@/src/entities/post';
import { type ApiError } from '@/src/shared/api';

import { type PostDetailQueryKey, postDetailQueryOptions } from './query-options';

export type PostDetailQueryOptions = Omit<
  UseQueryOptions<PostDetailDataType, ApiError, PostDetailDataType, PostDetailQueryKey>,
  'queryKey' | 'queryFn'
>;

export function usePostDetailQuery(postId: number, options?: PostDetailQueryOptions) {
  return useQuery({
    ...postDetailQueryOptions(postId),
    ...options,
  });
}
