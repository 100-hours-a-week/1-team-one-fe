export type QuestItemType = {
  questId: number;
  name: string;
  questImageUrl: string;
  type: string;
  rewardExp: number;
  targetCount: number;
  currentCount: number;
};

export type QuestListDataType = {
  quests: QuestItemType[];
};

export type QuestQueryParams = {
  isCompleted?: boolean;
};
