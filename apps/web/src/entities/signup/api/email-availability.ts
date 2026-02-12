import { type ApiError, getHttpClient } from '@/src/shared/api';

import type {
  EmailAvailabilityDataType,
  EmailAvailabilityResponseDTO,
} from './dto/availability.dto';
import {
  normalizeAvailabilityResponse,
  normalizeAvailabilityResponseFromError,
} from './lib/normalize-availability-response';

export async function fetchEmailAvailabilityFn(email: string): Promise<EmailAvailabilityDataType> {
  const client = getHttpClient({ requiresAuth: false });
  // TODO: URL 상수화
  try {
    const response = await client.get<EmailAvailabilityResponseDTO>('/auth/email-availability', {
      params: { email },
    });

    const normalized = normalizeAvailabilityResponse({
      payload: response.data,
      field: 'email',
    });

    if (!normalized) {
      throw new Error('email-availability:invalid-response');
    }

    return normalized;
  } catch (error) {
    const normalized = normalizeAvailabilityResponseFromError({
      error,
      field: 'email',
    });

    if (normalized) {
      return normalized;
    }

    throw error as ApiError;
  }
}
