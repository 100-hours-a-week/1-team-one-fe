import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import type { ApiError } from '@/src/shared/api';

import type { UserProfileDataType } from './dto/user-profile.dto';
import { type UserByIdQueryKey, userByIdQueryOptions } from './query-options';

export type { UserByIdQueryKey } from './query-options';

export type UserByIdQueryOptions = Omit<
  UseQueryOptions<UserProfileDataType, ApiError, UserProfileDataType, UserByIdQueryKey>,
  'queryKey' | 'queryFn'
>;

export function useUserByIdQuery(userId: number, options?: UserByIdQueryOptions) {
  return useQuery({
    ...userByIdQueryOptions(userId),
    ...options,
  });
}
