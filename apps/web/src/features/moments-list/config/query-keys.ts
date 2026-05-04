import { POST_QUERY_KEYS } from '@/src/entities/post';

import type { MomentsListQueryParams } from '../model/types';

export const MOMENTS_LIST_QUERY_KEYS = {
  root: POST_QUERY_KEYS.listRoot,
  metaPageRoot: POST_QUERY_KEYS.listMetaPageRoot,
  list: (params: MomentsListQueryParams) => POST_QUERY_KEYS.list(params),
} as const;
