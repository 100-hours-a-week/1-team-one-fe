import type { ApiResponse } from '@/src/shared/api';

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginTokensType {
  accessToken: string;
  refreshToken: string;
}

export interface LoginDataType {
  tokens: LoginTokensType;
  userId: number;
  isOnboardingCompleted: boolean;
}

export type LoginResponseDTO = ApiResponse<LoginDataType>;
