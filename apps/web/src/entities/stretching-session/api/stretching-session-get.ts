import { getHttpClient } from '@/src/shared/api';

import { toStretchingSession } from '../lib/to-stretching-session';
import type { StretchingSessionType } from '../model/types';
import type { StretchingSessionResponseDTO } from './dto/stretching-session.dto';

export async function fetchStretchingSessionFn(sessionId: string): Promise<StretchingSessionType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<StretchingSessionResponseDTO>(
    `/me/exercise-sessions/${encodeURIComponent(sessionId)}`,
  );
  return toStretchingSession(response.data.data);
}
