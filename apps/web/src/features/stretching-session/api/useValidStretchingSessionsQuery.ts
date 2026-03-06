import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type ValidStretchingSessionItemType } from '@/src/entities/stretching-session';
import { type ApiError } from '@/src/shared/api';

import {
  type ValidStretchingSessionsQueryKey,
  validStretchingSessionsQueryOptions,
} from './query-options';

export type { ValidStretchingSessionsQueryKey } from './query-options';

type ValidStretchingSessionsResult = ReadonlyArray<ValidStretchingSessionItemType> | null;

export type ValidStretchingSessionsQueryOptionsType = Omit<
  UseQueryOptions<
    ValidStretchingSessionsResult,
    ApiError,
    ValidStretchingSessionsResult,
    ValidStretchingSessionsQueryKey
  >,
  'queryKey' | 'queryFn'
>;

export function useValidStretchingSessionsQuery(options?: ValidStretchingSessionsQueryOptionsType) {
  return useQuery({
    ...validStretchingSessionsQueryOptions(),
    ...options,
  });
}
