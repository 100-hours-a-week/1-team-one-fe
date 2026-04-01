/**
 * 페이지별 ISR 캐시 전략
 */
export const CACHE_STRATEGIES = {
  MOMENTS_DETAIL: {
    revalidate: false as const, //게시글 수정/삭제 시 on-demand revalidation
  },
} as const;
