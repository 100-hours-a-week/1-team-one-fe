import { queryOptions } from '@tanstack/react-query';

import type { ApiError } from '@/src/shared/api';

import { SIGNUP_QUERY_KEYS } from '../config/query-keys';
import type {
  EmailAvailabilityDataType,
  NicknameAvailabilityDataType,
} from './dto/availability.dto';
import { fetchEmailAvailabilityFn } from './email-availability';
import { fetchNicknameAvailabilityFn } from './nickname-availability';

export type EmailAvailabilityQueryKey = ReturnType<typeof SIGNUP_QUERY_KEYS.emailAvailability>;
export type NicknameAvailabilityQueryKey = ReturnType<
  typeof SIGNUP_QUERY_KEYS.nicknameAvailability
>;

export function emailAvailabilityQueryOptions(email: string) {
  return queryOptions<
    EmailAvailabilityDataType,
    ApiError,
    EmailAvailabilityDataType,
    EmailAvailabilityQueryKey
  >({
    queryKey: SIGNUP_QUERY_KEYS.emailAvailability(email),
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
    queryKey: SIGNUP_QUERY_KEYS.nicknameAvailability(nickname),
    queryFn: () => fetchNicknameAvailabilityFn(nickname),
  });
}
