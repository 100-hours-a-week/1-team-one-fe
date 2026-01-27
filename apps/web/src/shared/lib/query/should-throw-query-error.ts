import { isApiError } from '@/src/shared/api';
import { HTTP_STATUS } from '@/src/shared/config/http-status';

export function shouldThrowQueryError(error: unknown): boolean {
  if (!isApiError(error)) {
    return false;
  }

  if (error.status === HTTP_STATUS.NOT_FOUND) {
    return true;
  }

  return error.status >= HTTP_STATUS.SERVER_ERROR_MIN;
}
