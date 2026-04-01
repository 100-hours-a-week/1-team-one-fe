import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import {
  type PostDetailDataType,
  type PostDetailQueryKey,
  postDetailQueryOptions,
} from '@/src/entities/post';
import { type ApiError } from '@/src/shared/api';

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
