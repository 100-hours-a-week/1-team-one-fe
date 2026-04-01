import { type ApiResponse, isApiError } from '@/src/shared/api';

import type {
  AvailabilityResultType,
  DuplicationFieldType,
  EmailAvailabilityDataType,
  NicknameAvailabilityDataType,
} from '../dto/availability.dto';

type AvailabilityData = EmailAvailabilityDataType | NicknameAvailabilityDataType;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isFieldReasonMessage = (
  value: unknown,
  field: DuplicationFieldType,
): value is { field: DuplicationFieldType; reason: string } => {
  if (!isRecord(value)) return false;
  if (value.field !== field) return false;
  return typeof value.reason === 'string' && value.reason.length > 0;
};

const hasAvailabilityData = (payload: unknown): payload is ApiResponse<AvailabilityData> => {
  if (!isRecord(payload)) return false;
  if (!('data' in payload)) return false;
  const data = payload.data;
  if (!isRecord(data)) return false;
  return typeof data.available === 'boolean';
};

/**
 * 서버 응답이 성공/중복 에러 두 형태일 때 타입 검사 후 동일한 포맷으로 반환하는 유틸
 */
export function normalizeAvailabilityResponse(args: {
  payload: unknown;
}): AvailabilityResultType | null {
  const { payload } = args;

  if (hasAvailabilityData(payload)) {
    return { available: payload.data.available };
  }

  return null;
}

/**
 * 서버 응답이 성공/중복 에러 두 형태일 때 타입 검사 후 동일한 포맷으로 반환하는 유틸
 */
export function normalizeAvailabilityResponseFromError(args: {
  error: unknown;
  field: DuplicationFieldType;
}): AvailabilityResultType | null {
  const { error, field } = args;
  if (!isApiError(error)) return null;
  if (!Array.isArray(error.errors)) return null;

  const matchedError = error.errors.find((entry) => isFieldReasonMessage(entry, field));

  if (!matchedError) return null;

  const code = typeof error.code === 'string' ? error.code : 'UNKNOWN_ERROR';

  return {
    available: false,
    error: {
      code,
      field,
      reason: matchedError.reason,
    },
  };
}
