import { getHttpClient } from '@/src/shared/api';
import { HEADERS } from '@/src/shared/config/headers';
import { createIdempotencyKey } from '@/src/shared/lib/crypto/create-idempotency-key';

import type {
  PostCreateDataType,
  PostCreateRequestDTO,
  PostCreateResponseDTO,
} from './dto/post-create.dto';

export async function createPostFn(payload: PostCreateRequestDTO): Promise<PostCreateDataType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.post<PostCreateResponseDTO>('/posts', payload, {
    headers: {
      [HEADERS.IDEMPOTENCY_KEY]: createIdempotencyKey(),
    },
  });

  return response.data.data;
}
