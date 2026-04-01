import type { ApiResponse } from '@/src/shared/api';

// 두 엔드포인트 모두 동일한 응답 구조
export type UpdateProfileResponseDataType = {
  nickname: string;
  imagePath: string;
};

export type UpdateProfileResponseDTO = ApiResponse<UpdateProfileResponseDataType>;

export type UpdateProfileImageRequestDTO = {
  imagePath: string;
};

export type UpdateProfileNicknameRequestDTO = {
  nickname: string;
};
