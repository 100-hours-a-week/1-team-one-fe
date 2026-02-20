import { getHttpClient } from '@/src/shared/api';

import type { PostDetailDataType, PostDetailResponseDTO } from './dto/post-detail.dto';

export async function fetchPostDetailFn(postId: number): Promise<PostDetailDataType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<PostDetailResponseDTO>(`/posts/${postId}`);
  return response.data.data.post;
}
