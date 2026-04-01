import { getHttpClient } from '@/src/shared/api';

import type { PostDetailDataType, PostDetailResponseDTO } from './dto/post-detail.dto';

export async function fetchPostDetailFn(postId: number): Promise<PostDetailDataType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<PostDetailResponseDTO>(`/posts/${postId}`);
  return response.data.data.post;
}

/** getStaticProps 전용 - real API 직접 호출, 항상 public 으로 호출함 */
export async function fetchPublicPostDetailFn(postId: number): Promise<PostDetailDataType> {
  const client = getHttpClient({ requiresAuth: false });
  const response = await client.get<PostDetailResponseDTO>(`/posts/${postId}`);
  return response.data.data.post;
}
