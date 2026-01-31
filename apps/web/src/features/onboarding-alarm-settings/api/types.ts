import type { AlarmSettingsRequest } from '@/src/entities/alarm-settings';
import type { ApiResponse } from '@/src/shared/api';

export type AlarmSettingsData = Record<string, never>;

export type AlarmSettingsResponse = ApiResponse<AlarmSettingsData>;

export type { AlarmSettingsRequest };
