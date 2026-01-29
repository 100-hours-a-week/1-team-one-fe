import { Card } from '@repo/ui/card';
import { Chip } from '@repo/ui/chip';

import type { CompleteExerciseSessionResponseData } from '@/src/features/exercise-session';

import { STRETCHING_SESSION_MESSAGES } from '../config/messages';

type StretchingSessionCompletionResultProps = {
  result: CompleteExerciseSessionResponseData | null;
  isLoading: boolean;
};

export function StretchingSessionCompletionResult({
  result,
  isLoading,
}: StretchingSessionCompletionResultProps) {
  //TODO: fallback ui 통일
  if (isLoading || !result) {
    return (
      <div className="bg-surface flex min-h-screen items-center justify-center px-6">
        <span className="text-text-muted text-sm font-medium">
          {STRETCHING_SESSION_MESSAGES.RESULT.PROCESSING}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen px-4 py-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        <h1 className="text-text text-xl font-semibold">
          {STRETCHING_SESSION_MESSAGES.RESULT.TITLE}
        </h1>

        <Card padding="md" variant="elevated" className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">{STRETCHING_SESSION_MESSAGES.RESULT.SESSION_ID}</span>
            <span className="text-text font-semibold">{result.sessionId}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">{STRETCHING_SESSION_MESSAGES.RESULT.COMPLETED}</span>
            <Chip
              label={
                result.isCompleted
                  ? STRETCHING_SESSION_MESSAGES.RESULT.COMPLETED_YES
                  : STRETCHING_SESSION_MESSAGES.RESULT.COMPLETED_NO
              }
              size="sm"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">{STRETCHING_SESSION_MESSAGES.RESULT.EARNED_EXP}</span>
            <span className="text-text font-semibold">{result.earnedExp}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">
              {STRETCHING_SESSION_MESSAGES.RESULT.EARNED_STATUS_SCORE}
            </span>
            <span className="text-text font-semibold">{result.earnedStatusScore}</span>
          </div>
        </Card>

        <Card padding="md" variant="elevated" className="flex flex-col gap-2">
          <span className="text-text text-sm font-semibold">
            {STRETCHING_SESSION_MESSAGES.RESULT.CHARACTER}
          </span>
          <div className="text-text grid grid-cols-2 gap-2 text-sm">
            <span className="text-text-muted">
              {STRETCHING_SESSION_MESSAGES.RESULT.CHARACTER_FIELDS.LEVEL}
            </span>
            <span className="text-text font-semibold">{result.character.level}</span>
            <span className="text-text-muted">
              {STRETCHING_SESSION_MESSAGES.RESULT.CHARACTER_FIELDS.EXP}
            </span>
            <span className="text-text font-semibold">{result.character.exp}</span>
            <span className="text-text-muted">
              {STRETCHING_SESSION_MESSAGES.RESULT.CHARACTER_FIELDS.STREAK}
            </span>
            <span className="text-text font-semibold">{result.character.streak}</span>
            <span className="text-text-muted">
              {STRETCHING_SESSION_MESSAGES.RESULT.CHARACTER_FIELDS.STATUS_SCORE}
            </span>
            <span className="text-text font-semibold">{result.character.statusScore}</span>
          </div>
        </Card>

        <Card padding="md" variant="elevated" className="flex flex-col gap-3">
          <span className="text-text text-sm font-semibold">
            {STRETCHING_SESSION_MESSAGES.RESULT.QUESTS}
          </span>
          {result.quests.map((quest) => (
            <div key={quest.id} className="flex flex-col gap-1 text-sm">
              <span className="text-text font-semibold">{quest.name}</span>
              <span className="text-text-muted">
                {quest.currentCount}/{quest.targetCount}
              </span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
