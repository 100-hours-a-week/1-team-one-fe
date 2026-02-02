import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { type ApiError, getHttpClient } from '@/src/shared/api';
import { HEADERS } from '@/src/shared/config/headers';
import { createIdempotencyKey } from '@/src/shared/lib/crypto/create-idempotency-key';

import { AUTH_QUERY_KEYS } from '../config/query-keys';
import type { SignupData, SignupRequest, SignupResponse } from './types';

async function signupRequest(payload: SignupRequest): Promise<SignupData> {
  const client = getHttpClient({ requiresAuth: false });
  const response = await client.post<SignupResponse>('/auth/sign-up', payload, {
    headers: {
      [HEADERS.IDEMPOTENCY_KEY]: createIdempotencyKey(),
    },
  });

  return response.data.data;
}

export type SignupMutationOptions = Omit<
  UseMutationOptions<SignupData, ApiError, SignupRequest>,
  'mutationFn'
>;

export function useSignupMutation(options?: SignupMutationOptions) {
  return useMutation({
    mutationKey: AUTH_QUERY_KEYS.signup(),
    mutationFn: signupRequest,
    ...options,
    meta: { ...options?.meta, disableToast: true },
  });
}
