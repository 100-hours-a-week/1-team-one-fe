import type { ExerciseSessionReportStatus } from '@/src/entities/exercise-session-report';

export const EXERCISE_STATUS_CHIP_CLASSNAME: Record<ExerciseSessionReportStatus, string> = {
  PENDING: 'bg-bg-muted text-text-muted border-0',
  COMPLETED: 'bg-brand-100 text-brand-800 border-0',
  FAILED: 'bg-error-100 text-error-800 border-0',
  SKIPPED: 'bg-bg-muted text-text-muted border-0',
} as const;

export const UNKNOWN_EXERCISE_STATUS_CHIP_CLASSNAME = 'bg-bg-muted text-text-muted border-0';

export const ROUTINE_COMPLETED_CARD_CLASSNAME = {
  COMPLETED: 'bg-brand-50 shadow-none',
  INCOMPLETE: 'bg-error-50 shadow-none',
} as const;
