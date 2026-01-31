import { Card } from '@repo/ui/card';

import type { CompleteExerciseSessionResponseData } from '@/src/features/exercise-session';

import { STRETCHING_SESSION_MESSAGES } from '../config/messages';
import { resolveCharacterBeforeState } from '../lib/resolve-character-before-state';
import { StretchingSessionResultCharacterCard } from './StretchingSessionResultCharacterCard';
import { StretchingSessionResultQuestList } from './StretchingSessionResultQuestList';
import { StretchingSessionResultRewardCard } from './StretchingSessionResultRewardCard';
import { StretchingSessionResultStatusCard } from './StretchingSessionResultStatusCard';

type StretchingSessionCompletionResultProps = {
  result: CompleteExerciseSessionResponseData | null;
  isLoading: boolean;
};

type StretchingResultStatus = 'success' | 'failure';

type StretchingResultUiConfig = {
  title: string;
  label: string;
  imageSrc: string;
  color: {
    bgClass: string;
    textClass: string;
    badgeClass: string;
  };
};

export const STRETCHING_RESULT_UI: Record<StretchingResultStatus, StretchingResultUiConfig> = {
  success: {
    title: STRETCHING_SESSION_MESSAGES.RESULT.STATUS.SUCCESS.TITLE,
    label: STRETCHING_SESSION_MESSAGES.RESULT.STATUS.SUCCESS.LABEL,
    imageSrc: '/images/stretch/result_success.png',
    color: {
      bgClass: 'bg-brand-50',
      textClass: 'text-brand-700',
      badgeClass: 'bg-brand-100 text-brand-800',
    },
  },
  failure: {
    title: STRETCHING_SESSION_MESSAGES.RESULT.STATUS.FAILURE.TITLE,
    label: STRETCHING_SESSION_MESSAGES.RESULT.STATUS.FAILURE.LABEL,
    imageSrc: '/images/stretch/result_fail.png',
    color: {
      bgClass: 'bg-danger-50',
      textClass: 'text-danger-700',
      badgeClass: 'bg-danger-100 text-danger-800',
    },
  },
};

export function StretchingSessionCompletionResult({
  result,
  isLoading,
}: StretchingSessionCompletionResultProps) {
  //TODO: fallback ui 통일
  if (isLoading || !result) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <span className="text-text-muted text-sm font-medium">
          {STRETCHING_SESSION_MESSAGES.RESULT.PROCESSING}
        </span>
      </div>
    );
  }

  const isSuccess = result.isCompleted;
  const statusKey: StretchingResultStatus = isSuccess ? 'success' : 'failure';
  const uiConfig = STRETCHING_RESULT_UI[statusKey];
  const safeEarnedExp = Math.max(0, result.earnedExp);
  const safeEarnedStatusScore = Math.max(0, result.earnedStatusScore);
  const hasReward = isSuccess && (safeEarnedExp > 0 || safeEarnedStatusScore > 0);
  const beforeState = resolveCharacterBeforeState(
    result.character,
    safeEarnedExp,
    safeEarnedStatusScore,
  );
  const isLevelUp = beforeState.levelsGained > 0;
  const resultMessages = STRETCHING_SESSION_MESSAGES.RESULT;
  const levelBadgeClassName = isLevelUp
    ? 'bg-brand-50 text-brand-700 animate-result-pulse'
    : 'bg-bg-muted text-text-muted';
  const imageAlt = isSuccess
    ? resultMessages.STATUS.SUCCESS.IMAGE_ALT
    : resultMessages.STATUS.FAILURE.IMAGE_ALT;
  const levelBadgeLabel = isLevelUp ? resultMessages.LEVEL_UP.BADGE : resultMessages.LEVEL_UP.KEEP;

  return (
    <div className="h-full w-full p-6">
      <Card
        padding="md"
        variant="elevated"
        className="animate-result-fade animate-result-delay-1 flex flex-col gap-4"
      >
        <StretchingSessionResultStatusCard
          title={uiConfig.title}
          label={uiConfig.label}
          imageSrc={uiConfig.imageSrc}
          imageAlt={imageAlt}
          color={uiConfig.color}
        />

        {hasReward && (
          <StretchingSessionResultRewardCard
            title={resultMessages.REWARDS.TITLE}
            badgeLabel={resultMessages.REWARDS.BADGE}
            expLabel={resultMessages.REWARDS.EXP}
            statusScoreLabel={resultMessages.REWARDS.STATUS_SCORE}
            earnedExp={safeEarnedExp}
            earnedStatusScore={safeEarnedStatusScore}
            deltaPrefix={resultMessages.DELTA_PREFIX}
          />
        )}

        <StretchingSessionResultCharacterCard
          character={result.character}
          beforeState={beforeState}
          earnedExp={safeEarnedExp}
          earnedStatusScore={safeEarnedStatusScore}
          badgeLabel={levelBadgeLabel}
          badgeClassName={levelBadgeClassName}
          labels={{
            title: resultMessages.CHARACTER,
            level: resultMessages.CHARACTER_FIELDS.LEVEL,
            exp: resultMessages.CHARACTER_FIELDS.EXP,
            streak: resultMessages.CHARACTER_FIELDS.STREAK,
            statusScore: resultMessages.CHARACTER_FIELDS.STATUS_SCORE,
            levelPrefix: resultMessages.LEVEL_PREFIX,
            beforeLabel: resultMessages.BEFORE_LABEL,
            afterLabel: resultMessages.AFTER_LABEL,
            valueArrow: resultMessages.VALUE_ARROW,
            deltaPrefix: resultMessages.DELTA_PREFIX,
            negativePrefix: resultMessages.DELTA_NEGATIVE_PREFIX,
          }}
        />

        <StretchingSessionResultQuestList title={resultMessages.QUESTS} quests={result.quests} />
      </Card>
    </div>
  );
}
