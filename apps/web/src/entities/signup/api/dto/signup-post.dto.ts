import type { ApiResponse } from '@/src/shared/api';

export interface SignupRequestDTO {
  email: string;
  nickname: string;
  password: string;
  imagePath?: string;
}

export interface SignupDataType {
  userId: number;
}

export type SignupResponseDTO = ApiResponse<SignupDataType>;
