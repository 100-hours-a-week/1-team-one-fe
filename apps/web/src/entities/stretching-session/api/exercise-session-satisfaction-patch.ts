import { getHttpClient } from '@/src/shared/api';

import type {
  SaveExerciseSessionSatisfactionDataType,
  SaveExerciseSessionSatisfactionRequestDTO,
  SaveExerciseSessionSatisfactionResponseDTO,
} from './dto/stretching-session.dto';

export async function saveExerciseSessionSatisfactionFn(
  sessionId: string,
  payload: SaveExerciseSessionSatisfactionRequestDTO,
): Promise<SaveExerciseSessionSatisfactionDataType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.patch<SaveExerciseSessionSatisfactionResponseDTO>(
    `/me/exercise-sessions/${encodeURIComponent(sessionId)}/satisfaction`,
    payload,
  );

  return response.data.data;
}
