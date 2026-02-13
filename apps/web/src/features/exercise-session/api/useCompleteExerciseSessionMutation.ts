import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import {
  completeExerciseSessionFn,
  type CompleteExerciseSessionRequestDTO,
  type CompleteExerciseSessionResponseDataType,
} from '@/src/entities/exercise-session';
import { type ApiError } from '@/src/shared/api';

import { EXERCISE_SESSION_QUERY_KEYS } from '../config/query-keys';

export type CompleteExerciseSessionMutationOptionsType = Omit<
  UseMutationOptions<
    CompleteExerciseSessionResponseDataType,
    ApiError,
    CompleteExerciseSessionRequestDTO
  >,
  'mutationFn'
> & {
  sessionId: string;
};

export function useCompleteExerciseSessionMutation(
  options: CompleteExerciseSessionMutationOptionsType,
) {
  const { sessionId, ...mutationOptions } = options;

  return useMutation({
    mutationKey: EXERCISE_SESSION_QUERY_KEYS.complete(sessionId),
    mutationFn: (payload) => completeExerciseSessionFn(sessionId, payload),
    ...mutationOptions,
  });
}
