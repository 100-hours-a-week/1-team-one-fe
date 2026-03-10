import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import {
  type MeQuestsQueryKey,
  meQuestsQueryOptions,
  type QuestListDataType,
  type QuestQueryParams,
} from '@/src/entities/quest';
import { type ApiError } from '@/src/shared/api';

export type MeQuestsQueryOptions = Omit<
  UseQueryOptions<QuestListDataType, ApiError, QuestListDataType, MeQuestsQueryKey>,
  'queryKey' | 'queryFn'
>;

export function useMeQuestsQuery(params: QuestQueryParams = {}, options?: MeQuestsQueryOptions) {
  return useQuery({
    ...meQuestsQueryOptions(params),
    ...options,
  });
}
