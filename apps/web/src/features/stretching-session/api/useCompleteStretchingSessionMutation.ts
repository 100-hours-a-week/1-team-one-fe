import { useQueryClient } from '@tanstack/react-query';

import {
  type CompleteExerciseSessionMutationOptions as CompleteExerciseSessionMutationOptionsType,
  useCompleteExerciseSessionMutation as useCompleteExerciseSessionMutationEntity,
} from '@/src/entities/stretching-session';

import {
  stretchingSessionQueryOptions,
  validStretchingSessionsQueryOptions,
} from './query-options';

export type CompleteStretchingSessionMutationOptionsType =
  CompleteExerciseSessionMutationOptionsType;

export function useCompleteStretchingSessionMutation(
  options: CompleteStretchingSessionMutationOptionsType,
) {
  const queryClient = useQueryClient();
  const { onSuccess, sessionId, ...restOptions } = options;

  return useCompleteExerciseSessionMutationEntity({
    sessionId,
    ...restOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        queryKey: stretchingSessionQueryOptions(sessionId).queryKey,
      });
      void queryClient.invalidateQueries({
        queryKey: validStretchingSessionsQueryOptions().queryKey,
      });
      onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
