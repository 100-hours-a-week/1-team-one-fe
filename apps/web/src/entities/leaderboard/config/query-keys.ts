export const LEADERBOARD_QUERY_KEYS = {
  root: () => ['leaderboard'] as const,
  listRoot: () => [...LEADERBOARD_QUERY_KEYS.root(), 'list'] as const,
  list: (limit: number) => [...LEADERBOARD_QUERY_KEYS.listRoot(), limit] as const,
} as const;
