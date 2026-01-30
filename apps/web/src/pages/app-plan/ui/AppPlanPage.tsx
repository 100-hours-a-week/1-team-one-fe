import { Button } from '@repo/ui/button';
import { useRouter } from 'next/router';

import { ROUTINE_PLAN_MESSAGES, useRoutineQuery } from '@/src/features/routine-plan';
import { ROUTES } from '@/src/shared/routes/routes';

import { APP_PLAN_PAGE_MESSAGES } from '../config/messages';
import { ExerciseCard } from './ExerciseCard';

export function AppPlanPage() {
  const router = useRouter();
  const { data, isLoading } = useRoutineQuery();

  const handleEditSurvey = () => {
    void router.push(ROUTES.SURVEY_EDIT);
  };

  //TODO: 공통 로딩 페이지 연결
  if (isLoading) {
    return <>로딩중</>;
  }

  if (!data || data.exercises.length === 0) {
    return <>데이터 없음</>;
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 px-5 pb-6">
      <div className="flex items-center justify-between pt-4">
        <h1 className="text-text text-xl font-bold">{APP_PLAN_PAGE_MESSAGES.HEADER.TITLE}</h1>
        <Button variant="outline" size="sm" onClick={handleEditSurvey}>
          {ROUTINE_PLAN_MESSAGES.SURVEY_EDIT.BUTTON}
        </Button>
      </div>

      <section className="flex flex-col gap-4">
        {data.exercises.map((exercise) => (
          <ExerciseCard key={exercise.exerciseId} exercise={exercise} />
        ))}
      </section>
    </div>
  );
}
