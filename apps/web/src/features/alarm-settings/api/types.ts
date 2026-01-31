import type { AlarmSettings } from '@/src/entities/alarm-settings';
import type { ApiResponse } from '@/src/shared/api';

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
