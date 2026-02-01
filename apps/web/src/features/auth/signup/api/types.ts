import type { ApiResponse } from '@/src/shared/api';

export type DuplicationField = 'email' | 'nickname';

export interface DuplicationErrorResponse {
  code: string;
  errors: {
    field: DuplicationField;
    reason: string;
  }[];
}
export interface AvailabilityResult {
  available: boolean;
  error?: {
    code: string;
    field: DuplicationField;
    reason: string;
  };
}

//응답값 통일
export type EmailAvailabilityData = AvailabilityResult;
export type NicknameAvailabilityData = AvailabilityResult;

// or -> 타입가드 필수
export type EmailAvailabilityResponse =
  | ApiResponse<EmailAvailabilityData>
  | DuplicationErrorResponse;
export type NicknameAvailabilityResponse =
  | ApiResponse<NicknameAvailabilityData>
  | DuplicationErrorResponse;

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
