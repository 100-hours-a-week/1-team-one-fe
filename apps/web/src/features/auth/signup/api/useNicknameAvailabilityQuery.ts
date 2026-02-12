import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import {
  fetchNicknameAvailabilityFn,
  type NicknameAvailabilityDataType,
} from '@/src/entities/signup';
import { type ApiError } from '@/src/shared/api';

import { AUTH_QUERY_KEYS } from '../config/query-keys';

export type NicknameAvailabilityQueryKey = ReturnType<typeof AUTH_QUERY_KEYS.nicknameAvailability>;

export type NicknameAvailabilityQueryOptions = Omit<
  UseQueryOptions<
    NicknameAvailabilityDataType,
    ApiError,
    NicknameAvailabilityDataType,
    NicknameAvailabilityQueryKey
  >,
  'queryKey' | 'queryFn'
>;

export function useNicknameAvailabilityQuery(
  nickname: string,
  options?: NicknameAvailabilityQueryOptions,
) {
  const hasNickname = Boolean(nickname);
  const enabled = hasNickname && (options?.enabled ?? true);

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.nicknameAvailability(nickname),
    queryFn: () => fetchNicknameAvailabilityFn(nickname),
    enabled,
    ...options,
    meta: { ...options?.meta, disableToast: true },
  });
}
