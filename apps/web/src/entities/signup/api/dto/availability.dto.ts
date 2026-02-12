import type { ApiResponse } from '@/src/shared/api';

export type DuplicationField = 'email' | 'nickname';

export interface DuplicationErrorResponseDTO {
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

export type EmailAvailabilityDataType = AvailabilityResult;
export type NicknameAvailabilityDataType = AvailabilityResult;

export type EmailAvailabilityResponseDTO =
  | ApiResponse<EmailAvailabilityDataType>
  | DuplicationErrorResponseDTO;
export type NicknameAvailabilityResponseDTO =
  | ApiResponse<NicknameAvailabilityDataType>
  | DuplicationErrorResponseDTO;
