export const EXERCISE_SESSION_REPORT_QUERY_KEYS = {
  root: () => ['exercise-session-report'] as const,
  list: () => [...EXERCISE_SESSION_REPORT_QUERY_KEYS.root(), 'list'] as const,
  detail: (reportId: number) =>
    [...EXERCISE_SESSION_REPORT_QUERY_KEYS.root(), 'detail', reportId] as const,
} as const;
