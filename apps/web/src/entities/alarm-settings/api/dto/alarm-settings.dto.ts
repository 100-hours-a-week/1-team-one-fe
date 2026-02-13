import type { ApiResponse } from '@/src/shared/api';

import type { AlarmSettingsType, WeekdayType } from '../../model/types';

export interface AlarmSettingsRequestDTO {
  interval: number;
  activeStartAt: string;
  activeEndAt: string;
  focusStartAt: string;
  focusEndAt: string;
  repeatDays: WeekdayType[];
}

export interface AlarmSettingsDataType {
  alarmSettings: AlarmSettingsType;
}

export type AlarmSettingsResponseDTO = ApiResponse<AlarmSettingsDataType>;
