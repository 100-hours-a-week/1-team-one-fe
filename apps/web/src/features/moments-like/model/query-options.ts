import { postListMetaPageRootQueryOptions, postListRootQueryOptions } from '@/src/entities/post';

//좋아요 동기화 대상 캐시를 정의
export const MOMENTS_LIKE_CACHE_TARGETS = {
  momentsListMetaPageRoot: postListMetaPageRootQueryOptions,
  momentsListRoot: postListRootQueryOptions,
} as const;

export type MomentsLikeTargetListMetaPageRootQueryKey = ReturnType<
  (typeof MOMENTS_LIKE_CACHE_TARGETS)['momentsListMetaPageRoot']
>['queryKey'];
export type MomentsLikeTargetListRootQueryKey = ReturnType<
  (typeof MOMENTS_LIKE_CACHE_TARGETS)['momentsListRoot']
>['queryKey'];
