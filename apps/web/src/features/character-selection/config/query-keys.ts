export const CHARACTER_SELECTION_QUERY_KEYS = {
  root: () => ['character'] as const,
  select: () => [...CHARACTER_SELECTION_QUERY_KEYS.root(), 'select'] as const,
} as const;
