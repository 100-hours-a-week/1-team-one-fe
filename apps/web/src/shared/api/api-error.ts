import type { AxiosError } from 'axios';

export interface FieldError {
  field?: string;
  reason: string;
}

export interface ApiError {
  status: number;
  code?: ApiErrorCode;
  message: string;
  errors?: FieldError[];
}

export interface ApiResponse<T> {
  code: string;
  data: T;
  message?: string;
}

export type ApiErrorCode =
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_UNAUTHORIZED'
  | 'CHARACTER_ALREADY_SET'
  | 'NOT_FOUND'
  | 'METHOD_NOT_ALLOWED'
  | 'INTERNAL_ERROR'
  | `${string}_MISSING`
  | 'VALIDATION_FAILED'
  | 'USER_EMAIL_DUPLICATED'
  | 'USER_NICKNAME_DUPLICATED'
  | 'USER_NICK_NAME_DUPLICATED';

interface ErrorResponse {
  code?: ApiErrorCode;
  message?: string;
  errors?: FieldError[];
}

export function toApiError(error: AxiosError<ErrorResponse>): ApiError {
  const status = error.response?.status ?? 500;
  const responseData = error.response?.data;
  const message =
    responseData?.message ??
    responseData?.errors?.[0]?.reason ??
    error.message ??
    '알 수 없는 오류가 발생했습니다.';

  return {
    status,
    code: responseData?.code,
    message,
    errors: responseData?.errors,
  };
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as ApiError).status === 'number'
  );
}
