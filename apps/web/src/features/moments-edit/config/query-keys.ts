export const MOMENTS_EDIT_QUERY_KEYS = {
  root: () => ['moments-edit'] as const,
  update: () => [...MOMENTS_EDIT_QUERY_KEYS.root(), 'update'] as const,
} as const;
