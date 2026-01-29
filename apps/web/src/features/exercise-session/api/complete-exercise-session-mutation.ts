import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { type ApiError, type ApiResponse, getHttpClient } from '@/src/shared/api';
import { HEADERS } from '@/src/shared/config/headers';
import { createIdempotencyKey } from '@/src/shared/lib/crypto/create-idempotency-key';

import { EXERCISE_SESSION_QUERY_KEYS } from '../config/query-keys';

export type ExerciseResultStatus = 'COMPLETED' | 'FAILED';

export type ExercisePoseRecordFrame = {
  frameId: number;
  time: string;
  keypoints: ReadonlyArray<ReadonlyArray<number>>;
};

export type ExerciseResultItem = {
  routineStepId: number;
  status: ExerciseResultStatus;
  accuracy: number;
  startAt: string;
  endAt: string;
  pose_record: ReadonlyArray<ExercisePoseRecordFrame>;
};

export type CompleteExerciseSessionRequest = {
  startAt: string;
  endAt: string;
  exerciseResult: ReadonlyArray<ExerciseResultItem>;
};

export type CompleteExerciseSessionResponseData = {
  sessionId: number;
  isCompleted: boolean;
  earnedExp: number;
  earnedStatusScore: number;
  character: {
    level: number;
    exp: number;
    streak: number;
    statusScore: number;
  };
  quests: ReadonlyArray<{
    id: number;
    name: string;
    targetCount: number;
    currentCount: number;
  }>;
};

type CompleteExerciseSessionResponse = ApiResponse<CompleteExerciseSessionResponseData>;

async function completeExerciseSession(
  sessionId: string,
  payload: CompleteExerciseSessionRequest,
): Promise<CompleteExerciseSessionResponseData> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.patch<CompleteExerciseSessionResponse>(
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

export type CompleteExerciseSessionMutationOptions = Omit<
  UseMutationOptions<CompleteExerciseSessionResponseData, ApiError, CompleteExerciseSessionRequest>,
  'mutationFn'
> & {
  sessionId: string;
};

export function useCompleteExerciseSessionMutation(
  options: CompleteExerciseSessionMutationOptions,
) {
  const { sessionId, ...mutationOptions } = options;

  return useMutation({
    mutationKey: EXERCISE_SESSION_QUERY_KEYS.complete(sessionId),
    mutationFn: (payload) => completeExerciseSession(sessionId, payload),
    ...mutationOptions,
  });
}
