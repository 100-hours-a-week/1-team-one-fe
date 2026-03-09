import { queryOptions } from '@tanstack/react-query';

import type { ApiError } from '@/src/shared/api';

import { QUEST_QUERY_KEYS } from '../config/query-keys';
import type { QuestListDataType, QuestQueryParams } from '../model/types';
import { fetchMeQuestsFn } from './quests-get';

export type MeQuestsQueryKey = ReturnType<typeof QUEST_QUERY_KEYS.list>;

export function meQuestsQueryOptions(params: QuestQueryParams = {}) {
  const { isCompleted } = params;

  return queryOptions<QuestListDataType, ApiError, QuestListDataType, MeQuestsQueryKey>({
    queryKey: QUEST_QUERY_KEYS.list(isCompleted),
    queryFn: () => fetchMeQuestsFn({ isCompleted }),
  });
}
