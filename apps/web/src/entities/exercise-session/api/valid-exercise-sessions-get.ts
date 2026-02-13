import { getHttpClient } from '@/src/shared/api';

import type { ValidExerciseSessionItemType, ValidExerciseSessionsResponseDTO } from './types';

export async function fetchValidExerciseSessionsFn(): Promise<ReadonlyArray<ValidExerciseSessionItemType> | null> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<ValidExerciseSessionsResponseDTO>(
    '/me/exercise-sessions/valid',
  );
  return response.data.data.sessions;
}
