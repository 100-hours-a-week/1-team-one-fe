import type { UserCharacter } from '@/src/features/user-profile';

export const CHARACTER_STATUS = {
  DYING: 'dying',
  HUNGRY_WEAK: 'hungry_weak',
  NORMAL: 'normal',
  HEALTHY: 'healthy',
  SUPER_HEALTHY: 'super_healthy',
} as const;

export type CharacterStatus = (typeof CHARACTER_STATUS)[keyof typeof CHARACTER_STATUS];

export const STATUS_SCORE_THRESHOLDS = {
  DYING_MAX: 19,
  HUNGRY_WEAK_MAX: 39,
  NORMAL_MAX: 59,
  HEALTHY_MAX: 79,
  SUPER_HEALTHY_MIN: 80,
} as const;

const CHARACTER_TYPE_DIR = {
  KEVIN: 'kevin',
  JAY: 'jay',
  CHARLIE: 'charlie',
} as const;

type CharacterType = keyof typeof CHARACTER_TYPE_DIR;

const isCharacterType = (value: string): value is CharacterType => value in CHARACTER_TYPE_DIR;

export const getCharacterStatusByScore = (statusScore: number): CharacterStatus => {
  const safeScore = Number.isNaN(statusScore) ? 0 : Math.max(0, Math.floor(statusScore));

  if (safeScore <= STATUS_SCORE_THRESHOLDS.DYING_MAX) return CHARACTER_STATUS.DYING;
  if (safeScore <= STATUS_SCORE_THRESHOLDS.HUNGRY_WEAK_MAX) return CHARACTER_STATUS.HUNGRY_WEAK;
  if (safeScore <= STATUS_SCORE_THRESHOLDS.NORMAL_MAX) return CHARACTER_STATUS.NORMAL;
  if (safeScore <= STATUS_SCORE_THRESHOLDS.HEALTHY_MAX) return CHARACTER_STATUS.HEALTHY;

  return CHARACTER_STATUS.SUPER_HEALTHY;
};

export const getCharacterImagePath = (
  character: Pick<UserCharacter, 'type'>,
  status: CharacterStatus,
): string => {
  const type = isCharacterType(character.type) ? character.type : 'KEVIN';
  const dir = CHARACTER_TYPE_DIR[type];

  return `/character/${dir}/${status}.png`;
};
