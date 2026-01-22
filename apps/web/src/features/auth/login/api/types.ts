import type { ApiResponse } from '@/src/shared/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginData {
  tokens: LoginTokens;
  userId: number;
  isOnboardingCompleted: boolean;
}

export type LoginResponse = ApiResponse<LoginData>;
