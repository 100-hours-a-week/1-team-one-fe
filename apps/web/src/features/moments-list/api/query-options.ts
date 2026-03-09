import {
  type PostListInfiniteQueryKey,
  type PostListInfiniteQueryOptions,
  postListInfiniteQueryOptions,
  type PostListRootQueryKey,
  postListRootQueryOptions,
} from '@/src/entities/post';

import { MOMENTS_LIST_CONFIG } from '../config/constants';
import type { MomentsListQueryParams } from '../model/types';

export type MomentsListInfiniteQueryKey = PostListInfiniteQueryKey;
export type MomentsListRootQueryKey = PostListRootQueryKey;
export type MomentsListInfiniteQueryOptions = PostListInfiniteQueryOptions;

export { postListRootQueryOptions as momentsListRootQueryOptions };

export function momentsListInfiniteQueryOptions(
  params: MomentsListQueryParams,
  isLoggedIn = false,
) {
  return postListInfiniteQueryOptions(params, isLoggedIn, MOMENTS_LIST_CONFIG.MAX_PAGES);
}
