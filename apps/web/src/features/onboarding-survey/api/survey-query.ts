import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type ApiError, getHttpClient } from '@/src/shared/api';

import { SURVEY_QUERY_KEYS } from '../config/query-keys';
import type { SurveyData, SurveyResponse } from './types';

async function fetchSurvey(): Promise<SurveyData> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<SurveyResponse>('/survey');

  return response.data.data;
}

export type SurveyQueryKey = ReturnType<typeof SURVEY_QUERY_KEYS.survey>;

export type SurveyQueryOptions = Omit<
  UseQueryOptions<SurveyData, ApiError, SurveyData, SurveyQueryKey>,
  'queryKey' | 'queryFn'
>;

export function useSurveyQuery(options?: SurveyQueryOptions) {
  return useQuery({
    queryKey: SURVEY_QUERY_KEYS.survey(),
    queryFn: fetchSurvey,
    staleTime: Infinity, //바뀔 일 없음
    ...options,
  });
}
