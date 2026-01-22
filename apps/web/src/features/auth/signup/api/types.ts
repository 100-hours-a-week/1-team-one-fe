import type { ApiResponse } from '@/src/shared/api';

export interface EmailAvailabilityData {
  available: boolean;
}

export interface NicknameAvailabilityData {
  available: boolean;
}

export type EmailAvailabilityResponse = ApiResponse<EmailAvailabilityData>;
export type NicknameAvailabilityResponse = ApiResponse<NicknameAvailabilityData>;

export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
  imagePath?: string;
}

export interface SignupData {
  userId: number;
}

export type SignupResponse = ApiResponse<SignupData>;
