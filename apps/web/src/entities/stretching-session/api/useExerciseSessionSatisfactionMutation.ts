import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { type ApiError } from '@/src/shared/api';

import { STRETCHING_SESSION_QUERY_KEYS } from '../config/query-keys';
import type {
  ExerciseSessionSatisfactionValue,
  SaveExerciseSessionSatisfactionDataType,
  SaveExerciseSessionSatisfactionRequestDTO,
} from './dto/stretching-session.dto';
import { saveExerciseSessionSatisfactionFn } from './exercise-session-satisfaction-patch';

export type SaveExerciseSessionSatisfactionRequest = SaveExerciseSessionSatisfactionRequestDTO;
export type SaveExerciseSessionSatisfactionResponseData = SaveExerciseSessionSatisfactionDataType;
export type ExerciseSessionSatisfaction = ExerciseSessionSatisfactionValue;

export type SaveExerciseSessionSatisfactionMutationOptions = Omit<
  UseMutationOptions<
    SaveExerciseSessionSatisfactionResponseData,
    ApiError,
    SaveExerciseSessionSatisfactionRequest
  >,
  'mutationFn'
> & {
  sessionId: string;
};

export function useExerciseSessionSatisfactionMutation(
  options: SaveExerciseSessionSatisfactionMutationOptions,
) {
  const { sessionId, ...mutationOptions } = options;

  return useMutation({
    mutationKey: STRETCHING_SESSION_QUERY_KEYS.satisfaction(sessionId),
    mutationFn: (payload) => saveExerciseSessionSatisfactionFn(sessionId, payload),
    ...mutationOptions,
  });
}
