import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import {
  completeStretchingSessionFn,
  type CompleteStretchingSessionRequestDTO,
  type CompleteStretchingSessionResponseDataType,
} from '@/src/entities/stretching-session';
import { type ApiError } from '@/src/shared/api';

import { STRETCHING_SESSION_QUERY_KEYS } from '../config/query-keys';

export type CompleteStretchingSessionMutationOptionsType = Omit<
  UseMutationOptions<
    CompleteStretchingSessionResponseDataType,
    ApiError,
    CompleteStretchingSessionRequestDTO
  >,
  'mutationFn'
> & {
  sessionId: string;
};

export function useCompleteStretchingSessionMutation(
  options: CompleteStretchingSessionMutationOptionsType,
) {
  const { sessionId, ...mutationOptions } = options;

  return useMutation({
    mutationKey: STRETCHING_SESSION_QUERY_KEYS.complete(sessionId),
    mutationFn: (payload) => completeStretchingSessionFn(sessionId, payload),
    ...mutationOptions,
  });
}
