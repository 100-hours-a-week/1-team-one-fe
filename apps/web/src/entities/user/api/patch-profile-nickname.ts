import { getHttpClient } from '@/src/shared/api';

import type {
  UpdateProfileNicknameRequestDTO,
  UpdateProfileResponseDataType,
  UpdateProfileResponseDTO,
} from './dto/update-profile.dto';

export async function patchProfileNicknameFn(
  payload: UpdateProfileNicknameRequestDTO,
): Promise<UpdateProfileResponseDataType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.patch<UpdateProfileResponseDTO>(
    '/users/me/profile/nickname',
    payload,
  );
  return response.data.data;
}
