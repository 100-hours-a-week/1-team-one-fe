import { getHttpClient } from '@/src/shared/api';

import type {
  PostLikeDataType,
  PostLikeRequestDTO,
  PostLikeResponseDTO,
} from './dto/post-like.dto';

export async function togglePostLikeFn(
  postId: number,
  payload: PostLikeRequestDTO,
): Promise<PostLikeDataType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.post<PostLikeResponseDTO>(`/posts/${postId}/like`, payload);
  return response.data.data;
}
