export interface FieldError {
  field: string;
  reason: string;
}

export interface ApiError {
  status: number;
  code?: string;
  message: string;
  errors?: FieldError[];
}

export interface ApiResponse<T> {
  code: string;
  data: T;
  message?: string;
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as ApiError).status === 'number'
  );
}
