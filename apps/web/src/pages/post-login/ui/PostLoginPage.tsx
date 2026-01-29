import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useOnboardingStatusQuery } from '@/src/features/onboarding-status';
import { POST_LOGIN_MESSAGES } from '@/src/pages/post-login/config/messages';
import { ROUTES } from '@/src/shared/routes';

const redirectByStatus = (status: string): string => {
  if (status === 'completed') return ROUTES.MAIN;
  if (status === 'incomplete') return ROUTES.ONBOARDING_SURVEY;
  if (status === 'unauthorized') return ROUTES.LOGIN;
  return ROUTES.LOGIN;
};

export function PostLoginPage() {
  const router = useRouter();
  const { data: onboardingStatus, isLoading } = useOnboardingStatusQuery({
    refetchOnMount: 'always',
    staleTime: 0,
  });

  useEffect(() => {
    if (!router.isReady) return;
    if (isLoading) return;
    if (!onboardingStatus) return;

    const nextRoute = redirectByStatus(onboardingStatus);
    void router.replace(nextRoute);
  }, [isLoading, onboardingStatus, router]);

  return (
    <div className="bg-bg text-text flex min-h-screen items-center justify-center px-6">
      <span className="text-text-muted text-sm font-medium">{POST_LOGIN_MESSAGES.LOADING}</span>
    </div>
  );
}
