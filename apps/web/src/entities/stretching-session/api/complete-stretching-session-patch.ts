import { getHttpClient } from '@/src/shared/api';
import { HEADERS } from '@/src/shared/config/headers';
import { createIdempotencyKey } from '@/src/shared/lib/crypto/create-idempotency-key';

import type {
  CompleteStretchingSessionRequestDTO,
  CompleteStretchingSessionResponseDataType,
  CompleteStretchingSessionResponseDTO,
} from './dto/stretching-session.dto';

export async function completeStretchingSessionFn(
  sessionId: string,
  payload: CompleteStretchingSessionRequestDTO,
): Promise<CompleteStretchingSessionResponseDataType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.patch<CompleteStretchingSessionResponseDTO>(
    `/me/exercise-sessions/${encodeURIComponent(sessionId)}`,
    payload,
    {
      headers: {
        [HEADERS.IDEMPOTENCY_KEY]: createIdempotencyKey(),
      },
    },
  );
  return response.data.data;
}
