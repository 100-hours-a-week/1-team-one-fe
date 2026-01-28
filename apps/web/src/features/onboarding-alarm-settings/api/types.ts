import type { ApiResponse } from '@/src/shared/api';

//TODO: 산재된 비슷한 타입 필드들 정리 필요
export interface AlarmSettingsRequest {
  interval: number;
  activeStartAt: string;
  activeEndAt: string;
  focusStartAt: string;
  focusEndAt: string;
  repeatDays: string[];
}

export type AlarmSettingsData = Record<string, never>;

export type AlarmSettingsResponse = ApiResponse<AlarmSettingsData>;
