import type {
  AlarmSettings,
  AlarmSettingsData,
  AlarmSettingsResponse,
} from '@/src/entities/alarm-settings';
import { ApiResponse } from '@/src/shared/api';

export type { AlarmSettings, AlarmSettingsData, AlarmSettingsResponse };

export interface DndUpdateRequest {
  dndFinishedAt: string;
}

export interface DndUpdateData {
  dndFinishedAt: string;
}

export type DndUpdateResponse = ApiResponse<DndUpdateData>;
