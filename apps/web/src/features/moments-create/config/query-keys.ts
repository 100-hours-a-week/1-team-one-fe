export const MOMENTS_CREATE_QUERY_KEYS = {
  root: () => ['moments-create'] as const,
  create: () => [...MOMENTS_CREATE_QUERY_KEYS.root(), 'create'] as const,
} as const;
