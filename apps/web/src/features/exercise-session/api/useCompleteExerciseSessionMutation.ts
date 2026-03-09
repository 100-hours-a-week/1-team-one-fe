import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import {
  type CompleteStretchingSessionAcceptedDataType,
  completeStretchingSessionFn,
  type CompleteStretchingSessionRequestDTO,
  type StretchingPoseRecordFrameType,
  type StretchingResultItemType,
  type StretchingResultStatusType,
} from '@/src/entities/stretching-session';
import { type ApiError } from '@/src/shared/api';

import { EXERCISE_SESSION_QUERY_KEYS } from '../config/query-keys';

async function completeExerciseSession(
  sessionId: string,
  payload: CompleteStretchingSessionRequestDTO,
): Promise<CompleteStretchingSessionAcceptedDataType> {
  return completeStretchingSessionFn(sessionId, payload);
}

export type ExerciseResultStatus = StretchingResultStatusType;
export type ExercisePoseRecordFrame = StretchingPoseRecordFrameType;
export type ExerciseResultItem = StretchingResultItemType;
export type CompleteExerciseSessionRequest = CompleteStretchingSessionRequestDTO;
export type CompleteExerciseSessionResponseData = CompleteStretchingSessionAcceptedDataType;

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
