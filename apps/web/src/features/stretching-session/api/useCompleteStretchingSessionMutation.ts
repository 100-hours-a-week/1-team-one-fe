import { useQueryClient } from '@tanstack/react-query';

import {
  type CompleteExerciseSessionMutationOptions as CompleteExerciseSessionMutationOptionsType,
  stretchingSessionQueryOptions,
  useCompleteExerciseSessionMutation as useCompleteExerciseSessionMutationEntity,
  validStretchingSessionsQueryOptions,
} from '@/src/entities/stretching-session';

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
