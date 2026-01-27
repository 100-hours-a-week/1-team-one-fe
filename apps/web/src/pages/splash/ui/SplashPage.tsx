import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { type OnboardingStatus, useOnboardingStatusQuery } from '@/src/features/onboarding-status';
import { ROUTES } from '@/src/shared/routes';

function resolveNextPath(onboardingStatus: OnboardingStatus): string {
  if (onboardingStatus === 'unauthorized') {
    return ROUTES.LOGIN;
  }

  if (onboardingStatus === 'incomplete') {
    return ROUTES.ONBOARDING_SURVEY;
  }

  if (onboardingStatus === 'completed') {
    return ROUTES.MAIN;
  }

  return ROUTES.LOGIN;
}
//TODO: redirect 한곳으로 몰도록 리팩토링
export function SplashPage() {
  const router = useRouter();
  const { data: onboardingStatus } = useOnboardingStatusQuery();

  useEffect(() => {
    if (!onboardingStatus) {
      return;
    }

    const nextPath = resolveNextPath(onboardingStatus);
    void router.replace(nextPath);
  }, [onboardingStatus, router]);

  return (
    <div className="animate-splash-bg from-brand-100 via-brand-200 to-brand-500 text-text-inverse flex min-h-dvh w-full items-center justify-center bg-linear-to-br px-6">
      <div className="animate-splash-fade flex flex-col items-center gap-6 text-center">
        <img src={'/icons/logo-with-bg.svg'} alt="Growing Developer" className="h-80 w-auto" />
      </div>
    </div>
  );
}
