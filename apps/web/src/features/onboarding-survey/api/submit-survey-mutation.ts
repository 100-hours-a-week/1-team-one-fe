import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { type ApiError, getHttpClient } from '@/src/shared/api';
import { HEADERS } from '@/src/shared/config/headers';
import { createIdempotencyKey } from '@/src/shared/lib/crypto/create-idempotency-key';

import { SURVEY_QUERY_KEYS } from '../config/query-keys';
import type {
  SurveySubmissionData,
  SurveySubmissionRequest,
  SurveySubmissionResponse,
} from './types';

async function submitSurveyRequest(
  payload: SurveySubmissionRequest,
): Promise<SurveySubmissionData> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.post<SurveySubmissionResponse>('/survey-submission', payload, {
    headers: {
      [HEADERS.IDEMPOTENCY_KEY]: createIdempotencyKey(),
    },
  });

  return response.data.data;
}

export type SubmitSurveyMutationOptions = Omit<
  UseMutationOptions<SurveySubmissionData, ApiError, SurveySubmissionRequest>,
  'mutationFn'
>;

export function useSubmitSurveyMutation(options?: SubmitSurveyMutationOptions) {
  return useMutation({
    mutationKey: [...SURVEY_QUERY_KEYS.root(), 'submission'] as const,
    mutationFn: submitSurveyRequest,
    ...options,
  });
}
