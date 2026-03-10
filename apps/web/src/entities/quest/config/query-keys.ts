function toQuestCompletionFilter(isCompleted?: boolean) {
  if (isCompleted) return 'completed';
  return 'in-progress';
}

export const QUEST_QUERY_KEYS = {
  root: () => ['quest'] as const,
  list: (isCompleted?: boolean) =>
    [...QUEST_QUERY_KEYS.root(), 'list', toQuestCompletionFilter(isCompleted)] as const,
} as const;
