import type { MomentsListQueryParams } from '../model/types';

export const MOMENTS_LIST_QUERY_KEYS = {
  root: () => ['moments-list'] as const,
  list: (params: MomentsListQueryParams, isLoggedIn?: boolean) =>
    [...MOMENTS_LIST_QUERY_KEYS.root(), params, { isLoggedIn: !!isLoggedIn }] as const,
} as const;
