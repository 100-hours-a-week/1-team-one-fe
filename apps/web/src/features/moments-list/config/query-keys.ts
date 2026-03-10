import { POST_QUERY_KEYS } from '@/src/entities/post';

import type { MomentsListQueryParams } from '../model/types';

export const MOMENTS_LIST_QUERY_KEYS = {
  root: POST_QUERY_KEYS.listRoot,
  list: (params: MomentsListQueryParams, isLoggedIn?: boolean) =>
    POST_QUERY_KEYS.list(params, isLoggedIn),
} as const;
