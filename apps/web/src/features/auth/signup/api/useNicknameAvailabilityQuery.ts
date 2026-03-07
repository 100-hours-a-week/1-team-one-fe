import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type NicknameAvailabilityDataType } from '@/src/entities/signup';
import { type ApiError } from '@/src/shared/api';

import {
  type NicknameAvailabilityQueryKey,
  nicknameAvailabilityQueryOptions,
} from './query-options';

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
    ...nicknameAvailabilityQueryOptions(nickname),
    enabled,
    ...options,
    meta: { ...options?.meta, disableToast: true },
  });
}
