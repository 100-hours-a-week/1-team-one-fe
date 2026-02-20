import { getHttpClient } from '@/src/shared/api';

import type { PostListResponse, PostListResponseData } from './dto/post-list.dto';

export type PostListParams = {
  limit?: number;
  cursor?: string | null;
  authorId?: number;
  tags?: string[];
};

function createQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item === undefined || item === null || item === '') {
          return;
        }

        searchParams.append(key, String(item));
      });
      return;
    }

    searchParams.append(key, String(value));
  });

  return searchParams.toString();
}

export async function fetchPostListPageFn(params: PostListParams): Promise<PostListResponseData> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<PostListResponse>('/posts', {
    params: {
      limit: params.limit,
      cursor: params.cursor ?? undefined,
      'author-id': params.authorId ?? undefined,
      tag: params.tags,
    },
    paramsSerializer: createQueryString,
  });

  return response.data.data;
}
