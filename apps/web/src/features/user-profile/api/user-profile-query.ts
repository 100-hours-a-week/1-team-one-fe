import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type ApiError } from '@/src/shared/api';

import { type UserProfileQueryKey, userProfileQueryOptions } from './query-options';
import type { UserMeData } from './types';

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
