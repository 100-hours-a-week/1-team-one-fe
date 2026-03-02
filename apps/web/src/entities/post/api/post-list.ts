import { getHttpClient } from '@/src/shared/api';

import { PostListResponseDataType, PostListResponseDTO } from './dto/post-list.dto';

export type PostListParams = {
  limit?: number;
  cursor?: string | null;
  authorId?: number;
  tags?: string[];
};

/**
 * axios 의 기본 params 직렬화 위한 함수
 * ?tag=a&tag=b 로 배열을 항상 고정하기 위함.
 * undefined, null, ' ' 처리 포함
 *  */
export function createQueryString(params: Record<string, unknown>): string {
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

export async function fetchPostListPageFn(
  params: PostListParams,
): Promise<PostListResponseDataType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<PostListResponseDTO>('/posts', {
    params: {
      limit: params.limit,
      cursor: params.cursor ?? undefined,
      'author-id': params.authorId ?? undefined, //특정 작성자의 게시글만 조회할 때 사용
      tag: params.tags,
    },
    paramsSerializer: createQueryString,
  });

  return response.data.data;
}
