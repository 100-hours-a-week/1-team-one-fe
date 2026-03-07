import { queryOptions } from '@tanstack/react-query';

import {
  type StretchingSessionResponseDTO,
  type StretchingSessionType,
  toStretchingSession,
} from '@/src/entities/stretching-session';
import { type ApiError, type ApiResponse, getHttpClient } from '@/src/shared/api';

import { EXERCISE_SESSION_QUERY_KEYS } from '../config/query-keys';

type ValidExerciseSessionsData = {
  sessions: ReadonlyArray<ValidExerciseSessionItem> | null;
};

type ValidExerciseSessionsResponse = ApiResponse<ValidExerciseSessionsData>;

export type ValidExerciseSessionItem = {
  sessionId: number;
  routineId: number;
  createdAt: string;
};

async function fetchExerciseSession(sessionId: string): Promise<StretchingSessionType> {
  const client = getHttpClient({ requiresAuth: true });

  const response = await client.get<StretchingSessionResponseDTO>(
    `/me/exercise-sessions/${encodeURIComponent(sessionId)}`,
  );
  return toStretchingSession(response.data.data);
}

async function fetchValidExerciseSessions(): Promise<ValidExerciseSessionsData['sessions']> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<ValidExerciseSessionsResponse>('/me/exercise-sessions/valid');
  return response.data.data.sessions;
}

export type ExerciseSessionQueryKey = ReturnType<typeof EXERCISE_SESSION_QUERY_KEYS.detail>;

export function exerciseSessionQueryOptions(sessionId: string) {
  return queryOptions<
    StretchingSessionType,
    ApiError,
    StretchingSessionType,
    ExerciseSessionQueryKey
  >({
    queryKey: EXERCISE_SESSION_QUERY_KEYS.detail(sessionId),
    queryFn: () => fetchExerciseSession(sessionId),
  });
}

export type ValidExerciseSessionsQueryKey = ReturnType<typeof EXERCISE_SESSION_QUERY_KEYS.valid>;

export function validExerciseSessionsQueryOptions() {
  return queryOptions<
    ValidExerciseSessionsData['sessions'],
    ApiError,
    ValidExerciseSessionsData['sessions'],
    ValidExerciseSessionsQueryKey
  >({
    queryKey: EXERCISE_SESSION_QUERY_KEYS.valid(),
    queryFn: fetchValidExerciseSessions,
  });
}
