import type { ApiResponse } from '@/src/shared/api';

export interface AlarmSettings {
  interval: number;
  activeStartAt: string;
  activeEndAt: string;
  focusStartAt: string;
  focusEndAt: string;
  repeatDays: string[];
  dnd: boolean;
  dndFinishedAt: string | null;
}

export interface AlarmSettingsData {
  alarmSettings: AlarmSettings;
}

export type AlarmSettingsResponse = ApiResponse<AlarmSettingsData>;

export interface DndUpdateRequest {
  dndFinishedAt: string;
}

export interface DndUpdateData {
  dndFinishedAt: string;
}

export type DndUpdateResponse = ApiResponse<DndUpdateData>;
