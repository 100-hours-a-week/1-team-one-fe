import type {
  FieldErrors,
  FieldValues,
  UseFormClearErrors,
  UseFormSetError,
} from 'react-hook-form';

import { SIGNUP_DUPLICATION_CODES } from '../config/duplication';
import { ApiErrorResponse } from '../model/api-error';

//TODO: 리팩토링

type SetError<T extends FieldValues> = UseFormSetError<T>;

const DUPLICATE_CODES = new Set([
  SIGNUP_DUPLICATION_CODES.EMAIL,
  SIGNUP_DUPLICATION_CODES.NICKNAME,
]) as Set<string>;

const VALIDATION_FAILED_CODE = 'VALIDATION_FAILED';

/**
 * 서버 에러 메세지 매퍼
 */
function normalizeReason(code: string, field: string, reason: string) {
  return reason;
}

export function applyApiErrorsToRHF<T extends Record<string, any>>(args: {
  error: unknown;
  setError: SetError<T>;

  onGlobalError?: (message: string, code?: string) => void; // 전역 에러 처리용 콜백
}) {
  const { error, setError, onGlobalError } = args;

  const e = error as Partial<ApiErrorResponse> | undefined;
  const code = e?.code ?? 'UNKNOWN_ERROR';
  const errors = e?.errors;

  // 필드 에러가 있으면 무조건 setError로 주입 (서버가 최종 판정)
  if (Array.isArray(errors) && errors.length > 0) {
    const isDuplicate = DUPLICATE_CODES.has(code);
    const isValidationFailed = code === VALIDATION_FAILED_CODE;

    for (const fe of errors) {
      //TODO: 상수화
      const type = isDuplicate ? 'duplicate' : isValidationFailed ? 'server-validation' : 'server';

      setError(fe.field as any, {
        type,
        message: normalizeReason(code, fe.field, fe.reason),
      });
    }

    return { handled: true, kind: 'field' as const, code };
  }

  // 필드 에러가 없다면 전역 에러로 처리
  const globalMessage = e?.message ?? '요청 처리 중 오류가 발생했어요.';
  onGlobalError?.(globalMessage, code);
  return { handled: true, kind: 'global' as const, code };
}

export function clearServerishFieldError<T extends Record<string, any>>(args: {
  field: keyof T;
  errors: FieldErrors<T>;
  clearErrors: UseFormClearErrors<T>;
}) {
  const { field, errors, clearErrors } = args;
  const err = errors[field];

  // RHF Error 타입 { type, message } 형태
  const type = (err as any)?.type as string | undefined;

  // 서버/중복 타입만 지움
  if (type === 'server' || type === 'duplicate' || type === 'server-validation') {
    clearErrors(field as any);
  }
}
