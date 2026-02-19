import { getHttpClient } from '@/src/shared/api';

import type { PostDetailData, PostDetailResponse } from './dto/post-detail.dto';

export async function fetchPostDetailFn(postId: number): Promise<PostDetailData> {
  const client = getHttpClient({ requiresAuth: false });
  const response = await client.get<PostDetailResponse>(`/posts/${postId}`);
  return response.data.data.post;
}
