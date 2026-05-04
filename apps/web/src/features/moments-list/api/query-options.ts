import {
  type PostListInfiniteQueryKey,
  type PostListInfiniteQueryOptions,
  postListInfiniteQueryOptions,
  type PostListMetaPageRootQueryKey,
  postListMetaPageRootQueryOptions,
  type PostListRootQueryKey,
  postListRootQueryOptions,
} from '@/src/entities/post';

import { MOMENTS_LIST_CONFIG } from '../config/constants';
import type { MomentsListQueryParams } from '../model/types';

export type MomentsListInfiniteQueryKey = PostListInfiniteQueryKey;
export type MomentsListMetaPageRootQueryKey = PostListMetaPageRootQueryKey;
export type MomentsListRootQueryKey = PostListRootQueryKey;
export type MomentsListInfiniteQueryOptions = PostListInfiniteQueryOptions;

export { postListMetaPageRootQueryOptions as momentsListMetaPageRootQueryOptions };
export { postListRootQueryOptions as momentsListRootQueryOptions };

export function momentsListInfiniteQueryOptions(params: MomentsListQueryParams) {
  return postListInfiniteQueryOptions(params, MOMENTS_LIST_CONFIG.MAX_PAGES);
}
