import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import {
  type StretchingSessionResponseDTO,
  type StretchingSessionType,
  toStretchingSession,
} from '@/src/entities/stretching-session';
import { type ApiError, getHttpClient } from '@/src/shared/api';

import { EXERCISE_SESSION_QUERY_KEYS } from '../config/query-keys';

async function fetchExerciseSession(sessionId: string): Promise<StretchingSessionType> {
  const client = getHttpClient({ requiresAuth: true });

  const response = await client.get<StretchingSessionResponseDTO>(
    `/me/exercise-sessions/${encodeURIComponent(sessionId)}`,
  );
  return toStretchingSession(response.data.data);
}

export type ExerciseSessionQueryKey = ReturnType<typeof EXERCISE_SESSION_QUERY_KEYS.detail>;

export type ExerciseSessionQueryOptions = Omit<
  UseQueryOptions<StretchingSessionType, ApiError, StretchingSessionType, ExerciseSessionQueryKey>,
  'queryKey' | 'queryFn'
>;

export function useExerciseSessionQuery(sessionId: string, options?: ExerciseSessionQueryOptions) {
  return useQuery({
    queryKey: EXERCISE_SESSION_QUERY_KEYS.detail(sessionId),
    queryFn: () => fetchExerciseSession(sessionId),
    ...options,
  });
}
