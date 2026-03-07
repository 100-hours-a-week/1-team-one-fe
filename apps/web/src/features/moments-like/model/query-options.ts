import { queryOptions } from '@tanstack/react-query';

//좋아요 동기화 대상 캐시를 정의
export const MOMENTS_LIKE_CACHE_TARGETS = {
  momentsListRoot: () =>
    queryOptions({
      queryKey: ['moments-list'] as const,
    }),
} as const;

export type MomentsLikeTargetListRootQueryKey = ReturnType<
  (typeof MOMENTS_LIKE_CACHE_TARGETS)['momentsListRoot']
>['queryKey'];
