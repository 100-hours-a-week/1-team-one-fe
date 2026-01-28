import type { ApiResponse } from '@/src/shared/api';

export type UserProfile = {
  nickname: string;
  imagePath: string | null;
};

export type UserCharacter = {
  type: string;
  name: string;
  level: number;
  exp: number;
  streak: number;
  statusScore: number;
};

export type UserMeData = {
  userId: number;
  profile: UserProfile;
  character: UserCharacter;
};

export type UserMeResponse = ApiResponse<UserMeData>;
