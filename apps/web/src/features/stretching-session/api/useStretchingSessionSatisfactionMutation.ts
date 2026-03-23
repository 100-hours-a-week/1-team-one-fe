import { useQueryClient } from '@tanstack/react-query';

import {
  type SaveExerciseSessionSatisfactionMutationOptions as SaveExerciseSessionSatisfactionMutationOptionsType,
  stretchingSessionQueryOptions,
  useExerciseSessionSatisfactionMutation as useExerciseSessionSatisfactionMutationEntity,
} from '@/src/entities/stretching-session';

export type StretchingSessionSatisfactionMutationOptionsType =
  SaveExerciseSessionSatisfactionMutationOptionsType;

export function useStretchingSessionSatisfactionMutation(
  options: StretchingSessionSatisfactionMutationOptionsType,
) {
  const queryClient = useQueryClient();
  const { onSuccess, sessionId, ...restOptions } = options;

  return useExerciseSessionSatisfactionMutationEntity({
    sessionId,
    ...restOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        queryKey: stretchingSessionQueryOptions(sessionId).queryKey,
      });
      onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
