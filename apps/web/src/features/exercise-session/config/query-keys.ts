export const EXERCISE_SESSION_QUERY_KEYS = {
  root: () => ['exercise-session'] as const,
  detail: (sessionId: string) => [...EXERCISE_SESSION_QUERY_KEYS.root(), sessionId] as const,
  complete: (sessionId: string) =>
    [...EXERCISE_SESSION_QUERY_KEYS.root(), sessionId, 'complete'] as const,
  valid: () => [...EXERCISE_SESSION_QUERY_KEYS.root(), 'valid'] as const,
} as const;
