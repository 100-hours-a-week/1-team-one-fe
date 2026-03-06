import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type PostMetaDataType } from '@/src/entities/post';
import { type ApiError } from '@/src/shared/api';

import { type PostDetailMetaQueryKey, postDetailMetaQueryOptions } from './query-options';

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
