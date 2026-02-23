import { getHttpClient } from '@/src/shared/api';

import type {
  AlarmSettingsDataType,
  AlarmSettingsRequestDTO,
  AlarmSettingsResponseDTO,
} from './dto/alarm-settings.dto';

export async function submitAlarmSettingsFn(
  values: AlarmSettingsRequestDTO,
): Promise<AlarmSettingsDataType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.put<AlarmSettingsResponseDTO>('/users/me/alarm-settings', values);

  return response.data.data;
}
