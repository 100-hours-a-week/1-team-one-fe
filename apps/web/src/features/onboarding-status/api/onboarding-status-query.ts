import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type ApiError, getHttpClient, isApiError } from '@/src/shared/api';
import { HTTP_STATUS } from '@/src/shared/config/http-status';

import { ONBOARDING_STATUS_QUERY_KEYS } from '../config/query-keys';
import type { OnboardingCompletedResponse } from './types';

export type OnboardingStatus = 'completed' | 'incomplete' | 'unauthorized' | 'error';

async function fetchOnboardingStatus(): Promise<OnboardingStatus> {
  const client = getHttpClient({ requiresAuth: true });

  try {
    const response = await client.get<OnboardingCompletedResponse>(
      '/users/me/onboarding-completed',
    );
    const { isOnboardingCompleted } = response.data.data;

    return isOnboardingCompleted ? 'completed' : 'incomplete';
  } catch (error) {
    if (isApiError(error) && error.status === HTTP_STATUS.UNAUTHORIZED) {
      return 'unauthorized';
    }

    return 'error';
  }
}

export type OnboardingStatusQueryKey = ReturnType<
  typeof ONBOARDING_STATUS_QUERY_KEYS.onboardingStatus
>;

export type OnboardingStatusQueryOptions = Omit<
  UseQueryOptions<OnboardingStatus, ApiError, OnboardingStatus, OnboardingStatusQueryKey>,
  'queryKey' | 'queryFn'
>;

export function useOnboardingStatusQuery(options?: OnboardingStatusQueryOptions) {
  return useQuery({
    queryKey: ONBOARDING_STATUS_QUERY_KEYS.onboardingStatus(),
    queryFn: fetchOnboardingStatus,
    retry: 0,
    staleTime: Infinity, // 진입 최초에만 확인하면 됨
    ...options,
  });
}
