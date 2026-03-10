import type { QuestType } from '@/src/entities/quest';

export const QUEST_TYPE_IMAGE_PATHS = {
  DAILY: '/images/quest/daily.png',
  WEEKLY: '/images/quest/weekly.png',
  EVENT: '/images/quest/event.png',
} as const satisfies Record<QuestType, string>;

export const QUEST_TYPE_LABELS = {
  DAILY: '일일',
  WEEKLY: '주간',
  EVENT: '이벤트',
} as const satisfies Record<QuestType, string>;

export const QUEST_TYPE_BADGE_CLASS_NAMES = {
  DAILY: 'bg-brand-50 text-brand-700 border-brand-200',
  WEEKLY: 'bg-success-100 text-success-700 border-success-300',
  EVENT: 'bg-warning-100 text-warning-700 border-warning-300',
} as const satisfies Record<QuestType, string>;

function getQuestTypeFallbackImagePath(type: string): string {
  switch (type) {
    case 'DAILY':
      return QUEST_TYPE_IMAGE_PATHS.DAILY;
    case 'WEEKLY':
      return QUEST_TYPE_IMAGE_PATHS.WEEKLY;
    case 'EVENT':
      return QUEST_TYPE_IMAGE_PATHS.EVENT;
    default:
      return QUEST_TYPE_IMAGE_PATHS.EVENT;
  }
}

export function resolveQuestImageSrc(
  questImagePath: string | null | undefined,
  type: string,
): string {
  if (typeof questImagePath === 'string' && questImagePath.trim().length > 0) {
    return questImagePath;
  }

  return getQuestTypeFallbackImagePath(type);
}

export function getQuestTypeLabel(type: string): string {
  switch (type) {
    case 'DAILY':
      return QUEST_TYPE_LABELS.DAILY;
    case 'WEEKLY':
      return QUEST_TYPE_LABELS.WEEKLY;
    case 'EVENT':
      return QUEST_TYPE_LABELS.EVENT;
    default:
      return QUEST_TYPE_LABELS.EVENT;
  }
}

export function getQuestTypeBadgeClassName(type: string): string {
  switch (type) {
    case 'DAILY':
      return QUEST_TYPE_BADGE_CLASS_NAMES.DAILY;
    case 'WEEKLY':
      return QUEST_TYPE_BADGE_CLASS_NAMES.WEEKLY;
    case 'EVENT':
      return QUEST_TYPE_BADGE_CLASS_NAMES.EVENT;
    default:
      return QUEST_TYPE_BADGE_CLASS_NAMES.EVENT;
  }
}
