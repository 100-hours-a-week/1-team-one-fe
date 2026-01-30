import type { UserCharacter } from '@/src/features/user-profile';

export const CHARACTER_STATUS = {
  DYING: 'dying',
  HUNGRY_WEAK: 'hungry_weak',
  NORMAL: 'normal',
  HEALTHY: 'healthy',
} as const;

export type CharacterStatus = (typeof CHARACTER_STATUS)[keyof typeof CHARACTER_STATUS];

export const STREAK_THRESHOLDS = {
  DYING_MAX: 0,
  HUNGRY_WEAK_MAX: 5,
  NORMAL_MAX: 9,
  HEALTHY_MIN: 10,
} as const;

const CHARACTER_TYPE_DIR = {
  KEVIN: 'kevin',
  JAY: 'jay',
  CHARLIE: 'charlie',
} as const;

type CharacterType = keyof typeof CHARACTER_TYPE_DIR;

const isCharacterType = (value: string): value is CharacterType => value in CHARACTER_TYPE_DIR;

export const getCharacterStatusByStreak = (streak: number): CharacterStatus => {
  const safeStreak = Number.isNaN(streak) ? 0 : Math.max(0, Math.floor(streak));

  if (safeStreak <= STREAK_THRESHOLDS.DYING_MAX) return CHARACTER_STATUS.DYING;
  if (safeStreak <= STREAK_THRESHOLDS.HUNGRY_WEAK_MAX) return CHARACTER_STATUS.HUNGRY_WEAK;
  if (safeStreak < STREAK_THRESHOLDS.HEALTHY_MIN) return CHARACTER_STATUS.NORMAL;

  return CHARACTER_STATUS.HEALTHY;
};

export const getCharacterImagePath = (
  character: Pick<UserCharacter, 'type'>,
  status: CharacterStatus,
): string => {
  const type = isCharacterType(character.type) ? character.type : 'KEVIN';
  const dir = CHARACTER_TYPE_DIR[type];

  return `/character/${dir}/${status}.png`;
};
