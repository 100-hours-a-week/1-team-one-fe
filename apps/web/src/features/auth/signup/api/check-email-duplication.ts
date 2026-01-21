import { httpClient } from '@/src/shared/mock-api/http-client';

import type { DuplicationCheckResponse } from './types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

export async function checkEmailDuplication(email: string): Promise<{ available: boolean }> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { available: true };
  }

  const { data } = await httpClient.post<DuplicationCheckResponse>('/auth/check-email', {
    email,
  });

  return { available: data.data.available };
}
