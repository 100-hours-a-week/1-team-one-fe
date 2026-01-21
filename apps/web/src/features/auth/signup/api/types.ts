export interface DuplicationCheckResponse {
  code: string;
  data: {
    available: boolean;
  };
}

export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

export interface SignupResponse {
  code: string;
  data: {
    userId: string;
  };
}
