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
  | 'ALARM_SETTING_NOT_FOUND'
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_UNAUTHORIZED'
  | 'CHARACTER_ALREADY_SET'
  | 'CHARACTER_NOT_SET'
  | 'INVALID_JSON'
  | 'INVALID_FILE_EXTENSION'
  | 'INTERNAL_SERVER_ERROR'
  | 'RESOURCE_NOT_FOUND'
  | 'UNSUPPORTED_MEDIA_TYPE'
  | 'JWT_ACCESS_EXPIRED'
  | 'JWT_ACCESS_INVALID'
  | 'JWT_REFRESH_EXPIRED'
  | 'JWT_REFRESH_INVALID'
  | 'JWT_MISSING'
  | 'NOT_FOUND'
  | 'METHOD_NOT_ALLOWED'
  | 'INTERNAL_ERROR'
  | 'EXERCISE_SESSION_REPORT_NOT_FOUND'
  | 'POST_NOT_FOUND'
  | 'PRESIGNED_URL_GENERATION_FAILED'
  | 'USER_NOT_FOUND'
  | `${string}_MISSING`
  | 'VALIDATION_FAILED'
  | 'USER_EMAIL_DUPLICATED'
  | 'USER_NICKNAME_DUPLICATED'
  | 'USER_NICK_NAME_DUPLICATED';

interface ErrorResponse {
  errors?: ErrorEntry[];
  code?: ApiErrorCode;
  message?: string;
}

interface ErrorEntry {
  code?: ApiErrorCode;
  messages?: ErrorMessageEntry[];
}

interface ErrorMessageEntry {
  field?: string | null;
  reason?: string;
}

function resolveApiErrorCode(
  entries: ErrorResponse['errors'],
  fallbackCode?: ApiErrorCode,
): ApiErrorCode | undefined {
  if (!Array.isArray(entries)) return fallbackCode;

  const matchedEntry = entries.find((entry) => typeof entry?.code === 'string');
  if (typeof matchedEntry?.code === 'string') {
    return matchedEntry.code;
  }

  return fallbackCode;
}

function normalizeFieldErrors(entries: ErrorResponse['errors']): FieldError[] | undefined {
  if (!Array.isArray(entries)) return undefined;

  const errors = entries.flatMap((entry) => {
    if (!Array.isArray(entry?.messages)) return [];

    return entry.messages.flatMap((message): FieldError[] => {
      if (typeof message?.reason !== 'string' || message.reason.length === 0) {
        return [];
      }

      if (typeof message.field === 'string' && message.field.length > 0) {
        return [{ field: message.field, reason: message.reason }];
      }

      return [{ reason: message.reason }];
    });
  });

  if (errors.length === 0) return undefined;
  return errors;
}

export function toApiError(error: AxiosError<ErrorResponse>): ApiError {
  const status = error.response?.status ?? 500;
  const responseData = error.response?.data;
  const normalizedErrors = normalizeFieldErrors(responseData?.errors);
  const code = resolveApiErrorCode(responseData?.errors, responseData?.code);
  const message =
    normalizedErrors?.[0]?.reason ??
    responseData?.message ??
    error.message ??
    '알 수 없는 오류가 발생했습니다.';

  return {
    status,
    code,
    message,
    errors: normalizedErrors,
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
