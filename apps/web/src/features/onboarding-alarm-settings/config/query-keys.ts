export const ALARM_SETTINGS_QUERY_KEYS = {
  root: () => ['alarm-settings'] as const,
  update: () => [...ALARM_SETTINGS_QUERY_KEYS.root(), 'update'] as const,
} as const;
