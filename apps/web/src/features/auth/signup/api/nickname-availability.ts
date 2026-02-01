import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { type ApiError, getHttpClient } from '@/src/shared/api';

import { AUTH_QUERY_KEYS } from '../config/query-keys';
import {
  normalizeAvailabilityResponse,
  normalizeAvailabilityResponseFromError,
} from '../lib/normalize-availability-response';
import type { NicknameAvailabilityData, NicknameAvailabilityResponse } from './types';

async function fetchNicknameAvailability(nickname: string): Promise<NicknameAvailabilityData> {
  const client = getHttpClient({ requiresAuth: false });
  try {
    const response = await client.get<NicknameAvailabilityResponse>('/auth/nickname-availability', {
      params: { nickname },
    });

    const normalized = normalizeAvailabilityResponse({
      payload: response.data,
      field: 'nickname',
    });

    if (!normalized) {
      throw new Error('nickname-availability:invalid-response');
    }

    return normalized;
  } catch (error) {
    const normalized = normalizeAvailabilityResponseFromError({
      error,
      field: 'nickname',
    });

    if (normalized) {
      return normalized;
    }

    throw error as ApiError;
  }
}

export type NicknameAvailabilityQueryKey = ReturnType<typeof AUTH_QUERY_KEYS.nicknameAvailability>;

export type NicknameAvailabilityQueryOptions = Omit<
  UseQueryOptions<
    NicknameAvailabilityData,
    ApiError,
    NicknameAvailabilityData,
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
    queryFn: () => fetchNicknameAvailability(nickname),
    enabled,
    ...options,
    meta: { ...options?.meta, disableToast: true },
  });
}
