import { Card } from '@repo/ui/card';
import { Chip } from '@repo/ui/chip';
import type { ReactNode } from 'react';

import type { CompleteExerciseSessionResponseData } from '@/src/features/exercise-session';

import type { CharacterBeforeState } from '../lib/resolve-character-before-state';

type CharacterLabels = {
  title: string;
  level: string;
  exp: string;
  streak: string;
  statusScore: string;
  levelPrefix: string;
  beforeLabel: string;
  afterLabel: string;
  valueArrow: string;
  deltaPrefix: string;
  negativePrefix: string;
};

type StretchingSessionResultCharacterCardProps = {
  character: CompleteExerciseSessionResponseData['character'];
  beforeState: CharacterBeforeState;
  earnedExp: number;
  earnedStatusScore: number;
  badgeLabel: string;
  badgeClassName: string;
  labels: CharacterLabels;
};

function formatLevelLabel(level: number, prefix: string) {
  return `${prefix} ${level}`;
}

function renderDeltaValue(value: number, prefix: string, className: string) {
  return (
    <span className={className}>
      {prefix}
      {value}
    </span>
  );
}

function resolveLevelValue(
  currentLevel: number,
  levelUpCount: number,
  prefix: string,
  deltaPrefix: string,
): ReactNode {
  if (levelUpCount <= 0) {
    return formatLevelLabel(currentLevel, prefix);
  }

  return (
    <>
      {formatLevelLabel(currentLevel, prefix)}{' '}
      <span className="text-brand-700 font-semibold">
        ({deltaPrefix}
        {levelUpCount})
      </span>
    </>
  );
}

function resolveExpValue(currentExp: number, earnedExp: number, deltaPrefix: string): ReactNode {
  if (earnedExp <= 0) {
    return currentExp;
  }

  return (
    <>
      {currentExp} {renderDeltaValue(earnedExp, deltaPrefix, 'text-brand-700 font-semibold')}
    </>
  );
}

function resolveStatusScoreValue(
  currentScore: number,
  beforeScore: number,
  deltaPrefix: string,
  negativePrefix: string,
): ReactNode {
  const delta = currentScore - beforeScore;

  if (delta > 0) {
    return (
      <>
        {currentScore} {renderDeltaValue(delta, deltaPrefix, 'text-brand-700 font-semibold')}
      </>
    );
  }

  if (delta < 0) {
    return (
      <>
        {currentScore}{' '}
        {renderDeltaValue(Math.abs(delta), negativePrefix, 'text-danger-700 font-semibold')}
      </>
    );
  }

  return currentScore;
}

export function StretchingSessionResultCharacterCard({
  character,
  beforeState,
  earnedExp,
  earnedStatusScore,
  badgeLabel,
  badgeClassName,
  labels,
}: StretchingSessionResultCharacterCardProps) {
  const levelValue = resolveLevelValue(
    character.level,
    beforeState.levelsGained,
    labels.levelPrefix,
    labels.deltaPrefix,
  );
  const expValue = resolveExpValue(character.exp, earnedExp, labels.deltaPrefix);
  const statusScoreValue = resolveStatusScoreValue(
    character.statusScore,
    beforeState.statusScore,
    labels.deltaPrefix,
    labels.negativePrefix,
  );

  return (
    <Card
      padding="md"
      variant="elevated"
      className="animate-result-fade animate-result-delay-3 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-text text-sm font-semibold">{labels.title}</span>
        <Chip label={badgeLabel} size="sm" className={badgeClassName} aria-live="polite" />
      </div>

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-text-muted">{labels.level}</span>
          <span className="text-text font-semibold">{levelValue}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-text-muted">{labels.exp}</span>
          <span className="text-text font-semibold">{expValue}</span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <span className="text-text-muted">{labels.streak}</span>
          <span className="text-text font-semibold">{character.streak}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-text-muted">{labels.statusScore}</span>
          <span className="text-text font-semibold">{statusScoreValue}</span>
        </div>
      </div>
    </Card>
  );
}
