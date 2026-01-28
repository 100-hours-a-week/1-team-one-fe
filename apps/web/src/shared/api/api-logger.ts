import type { ApiError } from './api-error';

export function logApiError(error: ApiError): void {
  console.error('[api-error]', {
    status: error.status,
    code: error.code,
    message: error.message,
  });
}
