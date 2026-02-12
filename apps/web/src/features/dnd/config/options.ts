import { DND_DURATION_MINUTES, DND_OPTION_IDS } from './constants';
import { DND_MESSAGES } from './messages';

export const DND_OPTIONS = [
  {
    id: DND_OPTION_IDS.MINUTES_15,
    minutes: DND_DURATION_MINUTES.MINUTES_15,
    label: DND_MESSAGES.OPTIONS.MINUTES_15,
  },
  {
    id: DND_OPTION_IDS.HOURS_1,
    minutes: DND_DURATION_MINUTES.HOURS_1,
    label: DND_MESSAGES.OPTIONS.HOURS_1,
  },
  {
    id: DND_OPTION_IDS.HOURS_8,
    minutes: DND_DURATION_MINUTES.HOURS_8,
    label: DND_MESSAGES.OPTIONS.HOURS_8,
  },
  {
    id: DND_OPTION_IDS.HOURS_24,
    minutes: DND_DURATION_MINUTES.HOURS_24,
    label: DND_MESSAGES.OPTIONS.HOURS_24,
  },
  {
    id: DND_OPTION_IDS.DAYS_3,
    minutes: DND_DURATION_MINUTES.DAYS_3,
    label: DND_MESSAGES.OPTIONS.DAYS_3,
  },
  {
    id: DND_OPTION_IDS.INFINITE,
    minutes: null,
    label: DND_MESSAGES.OPTIONS.INFINITE,
  },
] as const;
