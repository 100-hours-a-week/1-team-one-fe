import { getHttpClient } from '@/src/shared/api';

import { toExerciseSession } from '../lib/to-exercise-session';
import type { ExerciseSessionType } from '../model/types';
import type { ExerciseSessionResponseDTO } from './types';

export async function fetchExerciseSessionFn(sessionId: string): Promise<ExerciseSessionType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<ExerciseSessionResponseDTO>(
    `/me/exercise-sessions/${encodeURIComponent(sessionId)}`,
  );
  return toExerciseSession(response.data.data);
}
