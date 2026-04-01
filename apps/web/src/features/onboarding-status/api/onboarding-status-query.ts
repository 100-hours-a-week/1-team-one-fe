import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type ApiError } from '@/src/shared/api';

import {
  type OnboardingStatus,
  type OnboardingStatusQueryKey,
  onboardingStatusQueryOptions,
} from './query-options';

export type OnboardingStatusQueryOptions = Omit<
  UseQueryOptions<OnboardingStatus, ApiError, OnboardingStatus, OnboardingStatusQueryKey>,
  'queryKey' | 'queryFn'
>;

export function useOnboardingStatusQuery(options?: OnboardingStatusQueryOptions) {
  return useQuery({
    ...onboardingStatusQueryOptions(),
    ...options,
  });
}
