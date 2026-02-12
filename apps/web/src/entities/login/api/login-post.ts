import { getHttpClient } from '@/src/shared/api';

import type { LoginDataType, LoginRequestDTO, LoginResponseDTO } from './dto/login-post.dto';

export async function loginRequestFn(payload: LoginRequestDTO): Promise<LoginDataType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.post<LoginResponseDTO>('/auth/login', payload);

  return response.data.data;
}
