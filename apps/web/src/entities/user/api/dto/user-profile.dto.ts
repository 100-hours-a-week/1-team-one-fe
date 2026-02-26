import type { ApiResponse } from '@/src/shared/api';

export type UserProfileCharacterType = {
  type: string;
  name: string;
  level: number;
  exp: number;
  streak: number;
  statusScore: number;
};

export type UserProfileInfoType = {
  nickname: string;
  imagePath: string | null;
};

export type UserProfileDataType = {
  userId: number;
  profile: UserProfileInfoType;
  character: UserProfileCharacterType;
};

export type UserProfileResponseDTO = ApiResponse<UserProfileDataType>;
