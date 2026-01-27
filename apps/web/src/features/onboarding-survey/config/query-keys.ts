export const SURVEY_QUERY_KEYS = {
  root: () => ['survey'] as const,
  survey: () => [...SURVEY_QUERY_KEYS.root(), 'detail'] as const,
} as const;
