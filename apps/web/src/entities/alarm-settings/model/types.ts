import { WEEKDAY_VALUES } from '../config/constants';

export type WeekdayType = (typeof WEEKDAY_VALUES)[number];

export interface AlarmSettingsType {
  interval: number;
  activeStartAt: string;
  activeEndAt: string;
  focusStartAt: string;
  focusEndAt: string;
  repeatDays: WeekdayType[];
  dnd: boolean;
  dndFinishedAt: string | null;
}

export interface AlarmSettingsFormValuesType {
  intervalMinutes: number;
  activeStart: string;
  activeEnd: string;
  focusStart: string;
  focusEnd: string;
  weekdays: WeekdayType[];
}
