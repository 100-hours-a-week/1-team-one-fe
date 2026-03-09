export const QUEST_QUERY_KEYS = {
  root: () => ['quest'] as const,
  list: (isCompleted?: boolean) =>
    [...QUEST_QUERY_KEYS.root(), 'list', isCompleted ?? 'all'] as const,
} as const;
