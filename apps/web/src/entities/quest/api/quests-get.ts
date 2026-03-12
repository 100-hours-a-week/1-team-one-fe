import { getHttpClient } from '@/src/shared/api';

import type { QuestListDataType, QuestQueryParams } from '../model/types';
import { MeQuestsResponseDTO } from './dto/quests-get.dto';

function toIsCompletedParam(isCompleted?: boolean) {
  if (isCompleted) return true;
  return undefined;
}

export async function fetchMeQuestsFn(params: QuestQueryParams = {}): Promise<QuestListDataType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<MeQuestsResponseDTO>('/me/quests', {
    params: {
      'is-completed': toIsCompletedParam(params.isCompleted),
    },
  });

  return response.data.data;
}
