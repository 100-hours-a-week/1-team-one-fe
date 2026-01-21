import type { AxiosError } from 'axios';

import type { ApiError, FieldError } from './types';

interface ErrorResponse {
  code?: string;
  message?: string;
  errors?: FieldError[];
}

export function transformError(error: AxiosError<ErrorResponse>): ApiError {
  const status = error.response?.status ?? 500;
  const responseData = error.response?.data;

  return {
    status,
    code: responseData?.code,
    message: responseData?.message ?? error.message ?? '알 수 없는 오류가 발생했습니다.',
    errors: responseData?.errors,
  };
}
