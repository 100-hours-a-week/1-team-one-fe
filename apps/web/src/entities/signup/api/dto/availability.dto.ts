import type { ApiResponse } from '@/src/shared/api';

export type DuplicationFieldType = 'email' | 'nickname';

export interface DuplicationErrorResponseDTO {
  code: string;
  errors: {
    field: DuplicationFieldType;
    reason: string;
  }[];
}

export interface AvailabilityResultType {
  available: boolean;
  error?: {
    code: string;
    field: DuplicationFieldType;
    reason: string;
  };
}

export type EmailAvailabilityDataType = AvailabilityResultType;
export type NicknameAvailabilityDataType = AvailabilityResultType;

export type EmailAvailabilityResponseDTO =
  | ApiResponse<EmailAvailabilityDataType>
  | DuplicationErrorResponseDTO;
export type NicknameAvailabilityResponseDTO =
  | ApiResponse<NicknameAvailabilityDataType>
  | DuplicationErrorResponseDTO;
