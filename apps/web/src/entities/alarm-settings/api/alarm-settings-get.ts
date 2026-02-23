import { getHttpClient } from '@/src/shared/api';

import type { AlarmSettingsType } from '../model/types';
import type { AlarmSettingsResponseDTO } from './dto/alarm-settings.dto';

export async function fetchAlarmSettingsFn(): Promise<AlarmSettingsType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<AlarmSettingsResponseDTO>('/users/me/alarm-settings');

  return response.data.data.alarmSettings;
}
