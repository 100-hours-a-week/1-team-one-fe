import { queryOptions } from '@tanstack/react-query';

import {
  type EmailAvailabilityDataType,
  fetchEmailAvailabilityFn,
  fetchNicknameAvailabilityFn,
  type NicknameAvailabilityDataType,
} from '@/src/entities/signup';
import { type ApiError } from '@/src/shared/api';

import { AUTH_QUERY_KEYS } from '../config/query-keys';

export type EmailAvailabilityQueryKey = ReturnType<typeof AUTH_QUERY_KEYS.emailAvailability>;
export type NicknameAvailabilityQueryKey = ReturnType<typeof AUTH_QUERY_KEYS.nicknameAvailability>;

export function emailAvailabilityQueryOptions(email: string) {
  return queryOptions<
    EmailAvailabilityDataType,
    ApiError,
    EmailAvailabilityDataType,
    EmailAvailabilityQueryKey
  >({
    queryKey: AUTH_QUERY_KEYS.emailAvailability(email),
    queryFn: () => fetchEmailAvailabilityFn(email),
  });
}

export function nicknameAvailabilityQueryOptions(nickname: string) {
  return queryOptions<
    NicknameAvailabilityDataType,
    ApiError,
    NicknameAvailabilityDataType,
    NicknameAvailabilityQueryKey
  >({
    queryKey: AUTH_QUERY_KEYS.nicknameAvailability(nickname),
    queryFn: () => fetchNicknameAvailabilityFn(nickname),
  });
}
