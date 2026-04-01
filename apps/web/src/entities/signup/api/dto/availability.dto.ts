import type { ApiResponse } from '@/src/shared/api';

export type DuplicationFieldType = 'email' | 'nickname';

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

export type EmailAvailabilityResponseDTO = ApiResponse<EmailAvailabilityDataType>;
export type NicknameAvailabilityResponseDTO = ApiResponse<NicknameAvailabilityDataType>;
