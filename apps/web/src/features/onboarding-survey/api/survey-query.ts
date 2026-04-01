import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type ApiError } from '@/src/shared/api';

import { onboardingSurveyQueryOptions, type SurveyQueryKey } from './query-options';
import type { SurveyData } from './types';

export type SurveyQueryOptions = Omit<
  UseQueryOptions<SurveyData, ApiError, SurveyData, SurveyQueryKey>,
  'queryKey' | 'queryFn'
>;

export function useSurveyQuery(options?: SurveyQueryOptions) {
  return useQuery({
    ...onboardingSurveyQueryOptions(),
    ...options,
  });
}
