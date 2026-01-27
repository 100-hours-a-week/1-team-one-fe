import type { DupStatus } from '@repo/ui/form-field';

export interface DupState {
  status: DupStatus;
  message?: string;
}
