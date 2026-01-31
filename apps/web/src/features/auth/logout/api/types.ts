import type { ApiResponse } from '@/src/shared/api';

export interface LogoutData {
  revoked: boolean;
}

export type LogoutResponse = ApiResponse<LogoutData>;
