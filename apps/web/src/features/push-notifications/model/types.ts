export type PushNotificationType = 'SESSION_READY' | 'ROUTINE_REGEN_DONE';

export interface PushNotificationData {
  type?: PushNotificationType | string;
  sessionId?: string;
  routineId?: string;
  jobId?: string;
  submissionId?: string;
  reason?: string;
}
