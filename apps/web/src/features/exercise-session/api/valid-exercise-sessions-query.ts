import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type ApiError, type ApiResponse, getHttpClient } from '@/src/shared/api';

import { EXERCISE_SESSION_QUERY_KEYS } from '../config/query-keys';

export type ValidExerciseSessionItem = {
  sessionId: number;
  routineId: number;
  createdAt: string;
};

type ValidExerciseSessionsData = {
  sessions: ReadonlyArray<ValidExerciseSessionItem> | null;
};

type ValidExerciseSessionsResponse = ApiResponse<ValidExerciseSessionsData>;

async function fetchValidExerciseSessions(): Promise<ValidExerciseSessionsData['sessions']> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<ValidExerciseSessionsResponse>('/me/exercise-sessions/valid');
  return response.data.data.sessions;
}

export type ValidExerciseSessionsQueryKey = ReturnType<typeof EXERCISE_SESSION_QUERY_KEYS.valid>;

export type ValidExerciseSessionsQueryOptions = Omit<
  UseQueryOptions<
    ValidExerciseSessionsData['sessions'],
    ApiError,
    ValidExerciseSessionsData['sessions'],
    ValidExerciseSessionsQueryKey
  >,
  'queryKey' | 'queryFn'
>;

export function useValidExerciseSessionsQuery(options?: ValidExerciseSessionsQueryOptions) {
  return useQuery({
    queryKey: EXERCISE_SESSION_QUERY_KEYS.valid(),
    queryFn: fetchValidExerciseSessions,
    ...options,
  });
}
