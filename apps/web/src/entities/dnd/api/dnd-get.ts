import { getHttpClient } from '@/src/shared/api';

import type { DndStatusType } from '../model/types';
import type { DndGetResponseDTO } from './dto/dnd-get.dto';

export async function fetchDndStatusFn(): Promise<DndStatusType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<DndGetResponseDTO>('/users/me/alarm-settings/dnd');

  return response.data.data;
}
