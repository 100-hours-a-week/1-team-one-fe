export const ALARM_SETTINGS_QUERY_KEYS = {
  root: () => ['alarm-settings'] as const,
  detail: () => [...ALARM_SETTINGS_QUERY_KEYS.root(), 'detail'] as const,
  update: () => [...ALARM_SETTINGS_QUERY_KEYS.root(), 'update'] as const,
} as const;
