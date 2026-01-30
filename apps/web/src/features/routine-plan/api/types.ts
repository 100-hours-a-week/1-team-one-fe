import type { ApiResponse } from '@/src/shared/api';

export interface Exercise {
  exerciseId: number;
  name: string;
  content: string;
  reason: string;
}

export interface RoutineData {
  status: string;
  submissionId: number;
  exercises: Exercise[];
}

export type RoutineResponse = ApiResponse<RoutineData>;
