import { useRouter } from 'next/router';

import { OnboardingSurveyForm } from '@/src/features/onboarding-survey';
import { ROUTES } from '@/src/shared/routes';

export function OnboardingSurveyPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleComplete = () => {
    router.push(ROUTES.ONBOARDING_ALARM);
  };

  return <OnboardingSurveyForm onBack={handleBack} onComplete={handleComplete} />;
}
