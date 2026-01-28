export const ONBOARDING_STATUS_QUERY_KEYS = {
  root: () => ['auth'] as const,
  onboardingStatus: () => [...ONBOARDING_STATUS_QUERY_KEYS.root(), 'onboarding-status'] as const,
} as const;
