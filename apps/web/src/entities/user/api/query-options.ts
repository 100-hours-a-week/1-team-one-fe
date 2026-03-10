import { queryOptions } from '@tanstack/react-query';

import type { ApiError } from '@/src/shared/api';

import { USER_QUERY_KEYS } from '../config/query-keys';
import type { UserProfileDataType } from './dto/user-profile.dto';
import { fetchUserByIdFn } from './fetch-user-by-id';
import { fetchUserMeFn } from './fetch-user-me';

export type UserMeQueryKey = ReturnType<typeof USER_QUERY_KEYS.me>;
export type UserByIdQueryKey = ReturnType<typeof USER_QUERY_KEYS.byId>;

export function userMeQueryOptions() {
  return queryOptions<UserProfileDataType, ApiError, UserProfileDataType, UserMeQueryKey>({
    queryKey: USER_QUERY_KEYS.me(),
    queryFn: fetchUserMeFn,
  });
}

export function userByIdQueryOptions(userId: number) {
  return queryOptions<UserProfileDataType, ApiError, UserProfileDataType, UserByIdQueryKey>({
    queryKey: USER_QUERY_KEYS.byId(userId),
    queryFn: () => fetchUserByIdFn(userId),
  });
}
