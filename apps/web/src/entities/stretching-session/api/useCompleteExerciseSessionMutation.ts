import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { type ApiError } from '@/src/shared/api';

import { STRETCHING_SESSION_QUERY_KEYS } from '../config/query-keys';
import { completeStretchingSessionFn } from './complete-stretching-session-patch';
import type {
  CompleteStretchingSessionAcceptedDataType,
  CompleteStretchingSessionRequestDTO,
  StretchingPoseRecordFrameType,
  StretchingResultItemType,
  StretchingResultStatusType,
} from './dto/stretching-session.dto';

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
    mutationKey: STRETCHING_SESSION_QUERY_KEYS.complete(sessionId),
    mutationFn: (payload) => completeStretchingSessionFn(sessionId, payload),
    ...mutationOptions,
  });
}
