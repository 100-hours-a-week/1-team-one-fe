import { queryOptions } from '@tanstack/react-query';

import { type ApiError, getHttpClient } from '@/src/shared/api';

import { USER_PROFILE_QUERY_KEYS } from '../config/query-keys';
import type { UserMeData, UserMeResponse } from './types';

async function fetchUserProfile(): Promise<UserMeData> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<UserMeResponse>('/users/me');

  return response.data.data;
}

export type UserProfileQueryKey = ReturnType<typeof USER_PROFILE_QUERY_KEYS.me>;

export function userProfileQueryOptions() {
  return queryOptions<UserMeData, ApiError, UserMeData, UserProfileQueryKey>({
    queryKey: USER_PROFILE_QUERY_KEYS.me(),
    queryFn: fetchUserProfile,
  });
}
