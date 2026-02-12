import { type ApiError, getHttpClient } from '@/src/shared/api';

import type {
  NicknameAvailabilityDataType,
  NicknameAvailabilityResponseDTO,
} from './dto/availability.dto';
import {
  normalizeAvailabilityResponse,
  normalizeAvailabilityResponseFromError,
} from './lib/normalize-availability-response';

export async function fetchNicknameAvailabilityFn(
  nickname: string,
): Promise<NicknameAvailabilityDataType> {
  const client = getHttpClient({ requiresAuth: false });
  try {
    const response = await client.get<NicknameAvailabilityResponseDTO>(
      '/auth/nickname-availability',
      {
        params: { nickname },
      },
    );

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
