import { getHttpClient } from '@/src/shared/api';
import { HEADERS } from '@/src/shared/config/headers';
import { createIdempotencyKey } from '@/src/shared/lib/crypto/create-idempotency-key';

import type {
  CompleteStretchingSessionAcceptedDataType,
  CompleteStretchingSessionAcceptedResponseDTO,
  CompleteStretchingSessionRequestDTO,
} from './dto/stretching-session.dto';

export async function completeStretchingSessionFn(
  sessionId: string,
  payload: CompleteStretchingSessionRequestDTO,
): Promise<CompleteStretchingSessionAcceptedDataType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.patch<CompleteStretchingSessionAcceptedResponseDTO>(
    `/v2/me/exercise-sessions/${encodeURIComponent(sessionId)}`,
    payload,
    {
      headers: {
        [HEADERS.IDEMPOTENCY_KEY]: createIdempotencyKey(),
      },
    },
  );
  return response.data.data;
}
