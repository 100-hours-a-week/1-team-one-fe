import type { ApiResponse } from '@/src/shared/api';

import type {
  AvailabilityResult,
  DuplicationErrorResponse,
  DuplicationField,
  EmailAvailabilityData,
  NicknameAvailabilityData,
} from '../api/types';

type AvailabilityData = EmailAvailabilityData | NicknameAvailabilityData;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const hasAvailabilityData = (payload: unknown): payload is ApiResponse<AvailabilityData> => {
  if (!isRecord(payload)) return false;
  if (!('data' in payload)) return false;
  const data = payload.data;
  if (!isRecord(data)) return false;
  return typeof data.available === 'boolean';
};

const hasDuplicationErrors = (payload: unknown): payload is DuplicationErrorResponse => {
  if (!isRecord(payload)) return false;
  if (!('errors' in payload)) return false;
  if (!Array.isArray(payload.errors)) return false;
  if (!('code' in payload)) return false;
  return typeof payload.code === 'string';
};

const getDuplicationError = (
  payload: DuplicationErrorResponse,
  field: DuplicationField,
): AvailabilityResult['error'] | null => {
  const match = payload.errors.find(
    (error) =>
      isRecord(error) &&
      error.field === field &&
      typeof error.reason === 'string' &&
      error.reason.length > 0,
  );

  if (!match) return null;

  return {
    code: payload.code,
    field,
    reason: match.reason,
  };
};

/**
 * 서버 응답이 성공/중복 에러 두 형태일 때 타입 검사 후 동일한 포맷으로 반환하는 유틸
 */
export function normalizeAvailabilityResponse(args: {
  payload: unknown;
  field: DuplicationField;
}): AvailabilityResult | null {
  const { payload, field } = args;

  if (hasAvailabilityData(payload)) {
    return { available: payload.data.available };
  }

  if (hasDuplicationErrors(payload)) {
    const error = getDuplicationError(payload, field);
    if (!error) return null;
    return { available: false, error };
  }

  if (isRecord(payload) && hasDuplicationErrors(payload)) {
    const error = getDuplicationError(payload, field);
    if (!error) return null;
    return { available: false, error };
  }

  return null;
}

/**
 * 서버 응답이 성공/중복 에러 두 형태일 때 타입 검사 후 동일한 포맷으로 반환하는 유틸
 */
export function normalizeAvailabilityResponseFromError(args: {
  error: unknown;
  field: DuplicationField;
}): AvailabilityResult | null {
  const { error, field } = args;
  if (!isRecord(error)) return null;

  const apiError = error;
  if (!apiError.errors || !Array.isArray(apiError.errors)) return null;

  return normalizeAvailabilityResponse({
    payload: {
      code: apiError.code ?? 'UNKNOWN_ERROR',
      errors: apiError.errors,
    },
    field,
  });
}
