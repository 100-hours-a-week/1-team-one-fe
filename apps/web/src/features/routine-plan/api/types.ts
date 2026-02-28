import type { ApiResponse } from '@/src/shared/api';

export interface Exercise {
  exerciseId: number;
  name: string;
  content: string;
  reason: string;
}

export const ROUTINE_STATUSES = {
  PENDING: 'PENDING',
  REQUESTED: 'REQUESTED',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export type RoutineStatus = (typeof ROUTINE_STATUSES)[keyof typeof ROUTINE_STATUSES];

export interface RoutineData {
  status: RoutineStatus;
  activeSubmissionId: number | null;
  generatingSubmissionId: number | null;
  exercises: Exercise[];
}

export type RoutineResponse = ApiResponse<RoutineData>;
