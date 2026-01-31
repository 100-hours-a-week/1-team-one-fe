export const ALARM_SETTINGS_QUERY_KEYS = {
  root: () => ['alarm-settings'] as const,
  detail: () => [...ALARM_SETTINGS_QUERY_KEYS.root(), 'detail'] as const,
  dnd: () => [...ALARM_SETTINGS_QUERY_KEYS.root(), 'dnd'] as const,
} as const;
