import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import {
  type StretchingSessionQueryKey,
  stretchingSessionQueryOptions,
  type StretchingSessionType,
} from '@/src/entities/stretching-session';
import { type ApiError } from '@/src/shared/api';
export type { StretchingSessionQueryKey } from '@/src/entities/stretching-session';

export type StretchingSessionQueryOptionsType = Omit<
  UseQueryOptions<
    StretchingSessionType,
    ApiError,
    StretchingSessionType,
    StretchingSessionQueryKey
  >,
  'queryKey' | 'queryFn'
>;

export function useStretchingSessionQuery(
  sessionId: string,
  options?: StretchingSessionQueryOptionsType,
) {
  return useQuery({
    ...stretchingSessionQueryOptions(sessionId),
    ...options,
  });
}
