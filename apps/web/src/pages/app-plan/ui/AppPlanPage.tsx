import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { Spinner } from '@repo/ui/spinner';
import { useRouter } from 'next/router';

import {
  isRoutineGenerating,
  ROUTINE_PLAN_MESSAGES,
  useRoutineQuery,
} from '@/src/features/routine-plan';
import { ROUTES } from '@/src/shared/routes/routes';
import { LoadableBoundary } from '@/src/shared/ui/boundary';
import { ErrorScreen } from '@/src/shared/ui/error-screen';

import { APP_PLAN_PAGE_MESSAGES } from '../config/messages';
import { AppPlanPageSkeleton } from './AppPlanPage.skeleton';
import { ExerciseCard } from './ExerciseCard';

export function AppPlanPage() {
  const router = useRouter();
  const { data, isLoading, error } = useRoutineQuery();

  const handleEditSurvey = () => {
    void router.push(ROUTES.SURVEY_EDIT);
  };

  return (
    <LoadableBoundary
      isLoading={isLoading}
      error={error}
      data={data}
      isEmpty={Boolean(data && data.exercises.length === 0)}
      renderLoading={() => <AppPlanPageSkeleton />}
      renderError={() => <ErrorScreen variant="unexpected" />}
      renderEmpty={() => (
        <div className="text-text-muted flex min-h-screen items-center justify-center px-5 text-sm">
          {APP_PLAN_PAGE_MESSAGES.EMPTY}
        </div>
      )}
    >
      {(routine) => {
        const isGenerating = isRoutineGenerating(routine);

        return (
          <div className="flex min-h-screen flex-col gap-6 px-5 pb-6">
            <div className="flex items-center justify-between pt-4">
              <h1 className="text-text text-xl font-bold">{APP_PLAN_PAGE_MESSAGES.HEADER.TITLE}</h1>
              <Button variant="outline" size="sm" onClick={handleEditSurvey}>
                {ROUTINE_PLAN_MESSAGES.SURVEY_EDIT.BUTTON}
              </Button>
            </div>

            {isGenerating && (
              <Card
                variant="elevated"
                padding="none"
                className="bg-bg-subtle text-text flex items-start gap-3 px-4 py-3 text-sm"
                role="status"
                aria-live="polite"
              >
                <Spinner size="sm" className="mt-0.5 shrink-0" />
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">
                    {ROUTINE_PLAN_MESSAGES.GENERATING_NOTICE.TITLE}
                  </span>
                  <span className="text-text-muted">
                    {ROUTINE_PLAN_MESSAGES.GENERATING_NOTICE.DESCRIPTION}
                  </span>
                </div>
              </Card>
            )}

            <section className="flex flex-col gap-4">
              {routine.exercises.map((exercise) => (
                <ExerciseCard key={exercise.exerciseId} exercise={exercise} />
              ))}
            </section>
          </div>
        );
      }}
    </LoadableBoundary>
  );
}
