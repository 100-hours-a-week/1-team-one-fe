import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { OnboardingSurveyForm } from '@/src/features/onboarding-survey';
import { routinePlanQueryOptions } from '@/src/features/routine-plan';
import { ROUTES } from '@/src/shared/routes/routes';

export function SurveyEditPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleBack = () => {
    void router.push(ROUTES.PLAN);
  };

  const handleComplete = () => {
    void queryClient.invalidateQueries({
      queryKey: routinePlanQueryOptions().queryKey,
    });

    void router.push(ROUTES.PLAN);
  };

  return <OnboardingSurveyForm onBack={handleBack} onComplete={handleComplete} />;
}
