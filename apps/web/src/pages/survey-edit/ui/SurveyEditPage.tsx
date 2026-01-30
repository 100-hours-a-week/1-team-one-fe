import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { OnboardingSurveyForm } from '@/src/features/onboarding-survey';
import type { SurveySubmissionData } from '@/src/features/onboarding-survey/api/types';
import { ROUTINE_PLAN_QUERY_KEYS } from '@/src/features/routine-plan';
import { ROUTES } from '@/src/shared/routes/routes';

export function SurveyEditPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleBack = () => {
    void router.push(ROUTES.PLAN);
  };

  const handleComplete = (_data: SurveySubmissionData) => {
    void queryClient.invalidateQueries({
      queryKey: ROUTINE_PLAN_QUERY_KEYS.routine(),
    });

    void router.push(ROUTES.PLAN);
  };

  return <OnboardingSurveyForm onBack={handleBack} onComplete={handleComplete} />;
}
