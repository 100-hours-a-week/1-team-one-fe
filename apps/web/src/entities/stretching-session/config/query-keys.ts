export const STRETCHING_SESSION_QUERY_KEYS = {
  root: () => ['stretching-session'] as const,
  detail: (sessionId: string) => [...STRETCHING_SESSION_QUERY_KEYS.root(), sessionId] as const,
  complete: (sessionId: string) =>
    [...STRETCHING_SESSION_QUERY_KEYS.root(), sessionId, 'complete'] as const,
  valid: () => [...STRETCHING_SESSION_QUERY_KEYS.root(), 'valid'] as const,
} as const;
