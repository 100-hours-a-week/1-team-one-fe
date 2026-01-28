import type { ApiResponse } from '@/src/shared/api';

export type OnboardingCompletedData = {
  isOnboardingCompleted: boolean;
};

export type OnboardingCompletedResponse = ApiResponse<OnboardingCompletedData>;
