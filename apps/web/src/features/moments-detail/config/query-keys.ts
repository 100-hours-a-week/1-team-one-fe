export const MOMENTS_DETAIL_QUERY_KEYS = {
  all: ['moments-detail'] as const,
  detail: (postId: number) => [...MOMENTS_DETAIL_QUERY_KEYS.all, postId] as const,
};
