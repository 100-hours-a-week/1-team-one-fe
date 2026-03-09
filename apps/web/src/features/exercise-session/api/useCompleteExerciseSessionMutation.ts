import { useQueryClient } from '@tanstack/react-query';

import {
  type CompleteExerciseSessionMutationOptions as CompleteExerciseSessionMutationOptionsType,
  type CompleteExerciseSessionRequest,
  type CompleteExerciseSessionResponseData,
  type ExercisePoseRecordFrame,
  type ExerciseResultItem,
  type ExerciseResultStatus,
  useCompleteExerciseSessionMutation as useCompleteExerciseSessionMutationEntity,
} from '@/src/entities/stretching-session';

import { exerciseSessionQueryOptions, validExerciseSessionsQueryOptions } from './query-options';

export type {
  CompleteExerciseSessionRequest,
  CompleteExerciseSessionResponseData,
  ExercisePoseRecordFrame,
  ExerciseResultItem,
  ExerciseResultStatus,
};

export type CompleteExerciseSessionMutationOptions = CompleteExerciseSessionMutationOptionsType;

export function useCompleteExerciseSessionMutation(
  options: CompleteExerciseSessionMutationOptions,
) {
  const queryClient = useQueryClient();
  const { onSuccess, sessionId, ...restOptions } = options;

  return useCompleteExerciseSessionMutationEntity({
    sessionId,
    ...restOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        queryKey: exerciseSessionQueryOptions(sessionId).queryKey,
      });
      void queryClient.invalidateQueries({
        queryKey: validExerciseSessionsQueryOptions().queryKey,
      });
      onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
