export type QuestType = 'DAILY' | 'WEEKLY' | 'EVENT';

export type QuestItemType = {
  questId: number;
  name: string;
  questImagePath: string;
  type: QuestType;
  rewardExp: number;
  targetCount: number;
  currentCount: number;
  finishedAt: string;
};

export type QuestListDataType = {
  quests: QuestItemType[];
};

export type QuestQueryParams = {
  isCompleted?: boolean;
};
