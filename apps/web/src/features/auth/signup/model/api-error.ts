export type SignupField = 'email' | 'nickname' | 'password' | 'passwordConfirm' | 'profileImage';

export type ApiFieldError = {
  field: SignupField;
  reason: string;
};

export type ApiErrorResponse = {
  code: string;
  errors?: ApiFieldError[];
  message?: string; // 전역 메시지 있을 수 있으면
};
