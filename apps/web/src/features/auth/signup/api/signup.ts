import { httpClient } from '@/src/shared/mock-api/http-client';

import type { SignupRequest, SignupResponse } from './types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

export async function signup(data: SignupRequest): Promise<{ userId: string }> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { userId: 'mock-user-id' };
  }

  const response = await httpClient.post<SignupResponse>('/auth/signup', data);

  return { userId: response.data.data.userId };
}
