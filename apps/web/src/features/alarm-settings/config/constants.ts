export const DND_DURATION_MINUTES = {
  MINUTES_15: 15,
  HOURS_1: 60,
  HOURS_8: 480,
  HOURS_24: 1440,
  DAYS_3: 4320,
} as const;

export const DND_OPTION_IDS = {
  MINUTES_15: 'minutes_15',
  HOURS_1: 'hours_1',
  HOURS_8: 'hours_8',
  HOURS_24: 'hours_24',
  DAYS_3: 'days_3',
  INFINITE: 'infinite',
} as const;

export const DND_INFINITE_YEARS = 100 as const;

export type DndOptionId = (typeof DND_OPTION_IDS)[keyof typeof DND_OPTION_IDS];
