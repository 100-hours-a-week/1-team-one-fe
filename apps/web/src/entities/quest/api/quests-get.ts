import { getHttpClient } from '@/src/shared/api';

import type { QuestListDataType, QuestQueryParams } from '../model/types';
import type { MeQuestsResponseDTO } from './dto/quests-get.dto';

export async function fetchMeQuestsFn(params: QuestQueryParams = {}): Promise<QuestListDataType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<MeQuestsResponseDTO>('/me/quests', {
    params: {
      'is-completed': params.isCompleted,
    },
  });

  return response.data.data;
}
