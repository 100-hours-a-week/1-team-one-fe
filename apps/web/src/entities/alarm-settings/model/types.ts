import type { ApiResponse } from '@/src/shared/api';

import { WEEKDAY_VALUES } from '../config/constants';

export type Weekday = (typeof WEEKDAY_VALUES)[number];

export interface AlarmSettings {
  interval: number;
  activeStartAt: string;
  activeEndAt: string;
  focusStartAt: string;
  focusEndAt: string;
  repeatDays: Weekday[];
  dnd: boolean;
  dndFinishedAt: string | null;
}

export interface AlarmSettingsRequest {
  interval: number;
  activeStartAt: string;
  activeEndAt: string;
  focusStartAt: string;
  focusEndAt: string;
  repeatDays: Weekday[];
}

export interface AlarmSettingsFormValues {
  intervalMinutes: number;
  activeStart: string;
  activeEnd: string;
  focusStart: string;
  focusEnd: string;
  weekdays: Weekday[];
}

export interface AlarmSettingsData {
  alarmSettings: AlarmSettings;
}

export type AlarmSettingsResponse = ApiResponse<AlarmSettingsData>;
