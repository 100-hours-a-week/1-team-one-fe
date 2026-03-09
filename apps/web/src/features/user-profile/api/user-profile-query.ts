import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import {
  type UserMeQueryKey as UserProfileQueryKey,
  userMeQueryOptions as userProfileQueryOptions,
  type UserProfileDataType as UserMeData,
} from '@/src/entities/user';
import { type ApiError } from '@/src/shared/api';

export type UserProfileQueryOptions = Omit<
  UseQueryOptions<UserMeData, ApiError, UserMeData, UserProfileQueryKey>,
  'queryKey' | 'queryFn'
>;

export function useUserProfileQuery(options?: UserProfileQueryOptions) {
  return useQuery({
    ...userProfileQueryOptions(),
    ...options,
  });
}
