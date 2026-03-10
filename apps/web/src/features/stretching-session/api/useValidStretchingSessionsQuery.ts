import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import {
  type ValidStretchingSessionItemType,
  type ValidStretchingSessionsQueryKey,
  validStretchingSessionsQueryOptions,
} from '@/src/entities/stretching-session';
import { type ApiError } from '@/src/shared/api';
export type { ValidStretchingSessionsQueryKey } from '@/src/entities/stretching-session';

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
