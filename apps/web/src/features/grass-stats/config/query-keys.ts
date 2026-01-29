export const GRASS_STATS_QUERY_KEYS = {
  root: () => ['grass-stats'] as const,
  weekly: () => [...GRASS_STATS_QUERY_KEYS.root(), 'weekly'] as const,
  monthly: (month: string) => [...GRASS_STATS_QUERY_KEYS.root(), 'monthly', month] as const,
} as const;
