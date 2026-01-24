export const EXERCISE_SESSION_QUERY_KEYS = {
  root: () => ['exercise-session'] as const,
  detail: (sessionId: string) => [...EXERCISE_SESSION_QUERY_KEYS.root(), sessionId] as const,
} as const;
