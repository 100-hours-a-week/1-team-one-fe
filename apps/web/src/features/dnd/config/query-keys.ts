export const DND_QUERY_KEYS = {
  root: () => ['dnd'] as const,
  dnd: () => [...DND_QUERY_KEYS.root()] as const,
} as const;
