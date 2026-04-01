import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import {
  type PostDetailMetaQueryKey,
  postDetailMetaQueryOptions,
  type PostMetaDataType,
} from '@/src/entities/post';
import { type ApiError } from '@/src/shared/api';

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
    ...postDetailMetaQueryOptions(postId),
    ...options,
  });
}
