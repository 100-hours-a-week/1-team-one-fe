import { Card } from '@repo/ui/card';

import type { CompleteExerciseSessionResponseData } from '@/src/features/exercise-session';

type StretchingSessionResultQuestListProps = {
  title: string;
  quests: CompleteExerciseSessionResponseData['quests'];
};

export function StretchingSessionResultQuestList({
  title,
  quests,
}: StretchingSessionResultQuestListProps) {
  if (quests.length === 0) return null;

  return (
    <Card
      padding="md"
      variant="elevated"
      className="animate-result-fade animate-result-delay-4 flex flex-col gap-3"
    >
      <span className="text-text text-sm font-semibold">{title}</span>
      {quests.map((quest) => (
        <div key={quest.id} className="flex flex-col gap-1 text-sm">
          <span className="text-text font-semibold">{quest.name}</span>
          <span className="text-text-muted">
            {quest.currentCount}/{quest.targetCount}
          </span>
        </div>
      ))}
    </Card>
  );
}
