import { getHttpClient } from '@/src/shared/api';

import type {
  PostListMetaDataType,
  PostListMetaResponseDTO,
  PostMetaDataType,
  PostMetaResponseDTO,
} from './dto/post-meta.dto';
import type { PostListParams } from './post-list';
import { createQueryString } from './post-list';

export async function fetchPostMetaFn(postId: number): Promise<PostMetaDataType | null> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<PostMetaResponseDTO>(`/moments/posts/${postId}/meta`);
  return response.data.data?.post ?? null;
}

export async function fetchPostListMetaFn(
  params: PostListParams,
): Promise<PostListMetaDataType | null> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<PostListMetaResponseDTO>('/moments/posts/meta', {
    params: {
      limit: params.limit,
      cursor: params.cursor ?? undefined,
      'author-id': params.authorId ?? undefined,
      tag: params.tags,
    },
    paramsSerializer: createQueryString,
  });
  return response.data.data ?? null;
}
