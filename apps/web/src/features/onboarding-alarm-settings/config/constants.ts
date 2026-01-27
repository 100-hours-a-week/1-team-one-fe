export const INTERVAL_CONFIG = {
  MIN_MINUTES: 10,
  MAX_MINUTES: 600,
  STEP_MINUTES: 10,
  DEFAULT_MINUTES: 60,
} as const;

export const TIME_CONFIG = {
  DEFAULT_ACTIVE_START: '09:00',
  DEFAULT_ACTIVE_END: '18:00',
  DEFAULT_FOCUS_START: '12:00',
  DEFAULT_FOCUS_END: '13:00',
} as const;

export const DND_OPTION_VALUES = {
  ONE_HOUR: '60',
  THREE_HOURS: '180',
  EIGHT_HOURS: '480',
  TWENTY_FOUR_HOURS: '1440',
  UNTIL_REACTIVATED: 'until_reactivated',
} as const;

export const WEEKDAY_OPTIONS = [
  { value: 'MONDAY', label: '월' },
  { value: 'TUESDAY', label: '화' },
  { value: 'WEDNESDAY', label: '수' },
  { value: 'THURSDAY', label: '목' },
  { value: 'FRIDAY', label: '금' },
] as const;

export const DEFAULT_WEEKDAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'] as const;
