import { getHttpClient } from '@/src/shared/api';
import { HEADERS } from '@/src/shared/config/headers';
import { createIdempotencyKey } from '@/src/shared/lib/crypto/create-idempotency-key';

import type {
  CompleteExerciseSessionRequestDTO,
  CompleteExerciseSessionResponseDataType,
  CompleteExerciseSessionResponseDTO,
} from './dto/exercise-session.dto';

export async function completeExerciseSessionFn(
  sessionId: string,
  payload: CompleteExerciseSessionRequestDTO,
): Promise<CompleteExerciseSessionResponseDataType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.patch<CompleteExerciseSessionResponseDTO>(
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
