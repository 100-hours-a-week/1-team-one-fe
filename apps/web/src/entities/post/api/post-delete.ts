import { getHttpClient } from '@/src/shared/api';

import type {
  PostDeleteDataType,
  PostDeleteRequestDTO,
  PostDeleteResponseDTO,
} from './dto/post-delete.dto';

export async function deletePostFn({ postId }: PostDeleteRequestDTO): Promise<PostDeleteDataType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.delete<PostDeleteResponseDTO>(`/posts/${postId}`);

  return response.data.data;
}
