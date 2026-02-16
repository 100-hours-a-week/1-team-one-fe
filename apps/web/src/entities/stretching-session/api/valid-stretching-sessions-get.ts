import { getHttpClient } from '@/src/shared/api';

import type {
  ValidStretchingSessionItemType,
  ValidStretchingSessionsResponseDTO,
} from './dto/stretching-session.dto';

export async function fetchValidStretchingSessionsFn(): Promise<ReadonlyArray<ValidStretchingSessionItemType> | null> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<ValidStretchingSessionsResponseDTO>(
    '/me/exercise-sessions/valid',
  );
  return response.data.data.sessions;
}
