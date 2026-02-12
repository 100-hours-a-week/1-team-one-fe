import { getHttpClient } from '@/src/shared/api';

import type {
  DndUpdateDataType,
  DndUpdateRequestDTO,
  DndUpdateResponseDTO,
} from './dto/dnd-update.dto';

export async function submitDndFn(values: DndUpdateRequestDTO): Promise<DndUpdateDataType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.put<DndUpdateResponseDTO>('/users/me/alarm-settings/dnd', values);

  return response.data.data;
}
