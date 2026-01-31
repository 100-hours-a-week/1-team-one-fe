import type { CompleteExerciseSessionResponseData } from '@/src/features/exercise-session';

import { STRETCHING_SESSION_CONFIG } from '../config/constants';

type CharacterSnapshot = CompleteExerciseSessionResponseData['character'];

export type CharacterBeforeState = {
  level: number;
  exp: number;
  statusScore: number;
  levelsGained: number;
};

const EXP_PER_LEVEL = STRETCHING_SESSION_CONFIG.CHARACTER_LEVEL_EXP_THRESHOLD;

export function resolveCharacterBeforeState(
  character: CharacterSnapshot,
  earnedExp: number,
  earnedStatusScore: number,
): CharacterBeforeState {
  const safeEarnedExp = Math.max(0, earnedExp);

  let levelsGained = 0;
  const expGap = safeEarnedExp - character.exp;

  if (expGap > 0) {
    levelsGained = Math.ceil(expGap / EXP_PER_LEVEL);
  }

  const beforeLevel = Math.max(0, character.level - levelsGained);
  const beforeExp = character.exp - safeEarnedExp + levelsGained * EXP_PER_LEVEL;
  const beforeStatusScore = character.statusScore - earnedStatusScore;

  return {
    level: beforeLevel,
    exp: Math.max(0, beforeExp),
    statusScore: Math.max(0, beforeStatusScore),
    levelsGained,
  };
}
