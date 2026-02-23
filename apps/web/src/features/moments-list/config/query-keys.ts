import type { MomentsListQueryParams } from '../model/types';

export const MOMENTS_LIST_QUERY_KEYS = {
  root: () => ['moments-list'] as const,
  list: (params: MomentsListQueryParams) => [...MOMENTS_LIST_QUERY_KEYS.root(), params] as const,
} as const;
