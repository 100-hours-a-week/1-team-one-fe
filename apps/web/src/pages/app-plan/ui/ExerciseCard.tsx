import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';

import { type Exercise, ROUTINE_PLAN_MESSAGES } from '@/src/features/routine-plan';

export interface ExerciseCardProps {
  exercise: Exercise;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <Card variant="elevated" padding="md">
      <CardHeader>
        <CardTitle>{exercise.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-text text-base">{exercise.content}</p>
        <div className="border-border-strong rounded-lg border p-3">
          <p className="text-text-muted mb-1 text-sm font-medium">
            {ROUTINE_PLAN_MESSAGES.EXERCISE.REASON_LABEL}
          </p>
          <p className="text-text text-sm">{exercise.reason}</p>
        </div>
      </CardContent>
    </Card>
  );
}
