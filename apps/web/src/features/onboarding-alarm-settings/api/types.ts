import type { ApiResponse } from '@/src/shared/api';

export interface AlarmSettingsRequest {
  interval: number;
  activeStartAt: string;
  activeEndAt: string;
  focusStartAt: string;
  focusEndAt: string;
  repeatDays: string[];
  dndFinishedAt: string;
}

export type AlarmSettingsData = Record<string, never>;

export type AlarmSettingsResponse = ApiResponse<AlarmSettingsData>;
