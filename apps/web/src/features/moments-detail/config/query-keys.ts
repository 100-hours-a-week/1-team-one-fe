import { POST_QUERY_KEYS } from '@/src/entities/post';

export const MOMENTS_DETAIL_QUERY_KEYS = {
  all: POST_QUERY_KEYS.root(),
  detail: POST_QUERY_KEYS.detail,
  meta: POST_QUERY_KEYS.meta,
} as const;
