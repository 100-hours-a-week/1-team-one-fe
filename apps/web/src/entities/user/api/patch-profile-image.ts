import { getHttpClient } from '@/src/shared/api';

import type {
  UpdateProfileImageRequestDTO,
  UpdateProfileResponseDataType,
  UpdateProfileResponseDTO,
} from './dto/update-profile.dto';

export async function patchProfileImageFn(
  payload: UpdateProfileImageRequestDTO,
): Promise<UpdateProfileResponseDataType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.patch<UpdateProfileResponseDTO>('/users/me/profile/image', payload);
  return response.data.data;
}
