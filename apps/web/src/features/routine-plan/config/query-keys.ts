export const ROUTINE_PLAN_QUERY_KEYS = {
  root: () => ['routine-plan'] as const,
  routine: () => [...ROUTINE_PLAN_QUERY_KEYS.root(), 'routine'] as const,
} as const;
