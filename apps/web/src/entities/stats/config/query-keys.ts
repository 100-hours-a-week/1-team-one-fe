export const STATS_QUERY_KEYS = {
  root: () => ['stats'] as const,
  summary: () => [...STATS_QUERY_KEYS.root(), 'summary'] as const,
} as const;
