import { getHttpClient } from '@/src/shared/api';
import { HEADERS } from '@/src/shared/config/headers';
import { createIdempotencyKey } from '@/src/shared/lib/crypto/create-idempotency-key';

import type { SignupDataType, SignupRequestDTO, SignupResponseDTO } from './dto/signup-post.dto';

export async function signupRequestFn(payload: SignupRequestDTO): Promise<SignupDataType> {
  const client = getHttpClient({ requiresAuth: false });
  const response = await client.post<SignupResponseDTO>('/auth/sign-up', payload, {
    headers: {
      [HEADERS.IDEMPOTENCY_KEY]: createIdempotencyKey(),
    },
  });

  return response.data.data;
}
