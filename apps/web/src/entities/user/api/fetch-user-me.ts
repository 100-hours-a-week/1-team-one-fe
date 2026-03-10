import { getHttpClient } from '@/src/shared/api';

import type { UserProfileDataType, UserProfileResponseDTO } from './dto/user-profile.dto';

export async function fetchUserMeFn(): Promise<UserProfileDataType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<UserProfileResponseDTO>('/users/me');

  return response.data.data;
}
