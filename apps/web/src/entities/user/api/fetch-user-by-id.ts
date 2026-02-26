import { getHttpClient } from '@/src/shared/api';

import type { UserProfileDataType, UserProfileResponseDTO } from './dto/user-profile.dto';

export async function fetchUserByIdFn(userId: number): Promise<UserProfileDataType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<UserProfileResponseDTO>(`/users/${userId}`);

  return response.data.data;
}
