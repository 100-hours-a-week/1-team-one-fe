import { getHttpClient } from '@/src/shared/api';

import type {
  PostUpdateDataType,
  PostUpdateRequestDTO,
  PostUpdateResponseDTO,
} from './dto/post-update.dto';

export async function updatePostFn(payload: PostUpdateRequestDTO): Promise<PostUpdateDataType> {
  const { postId, ...body } = payload;
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.put<PostUpdateResponseDTO>(`/posts/${postId}`, body);

  return response.data.data;
}
