import { getHttpClient } from '@/src/shared/api';

import type { ExerciseSessionReportListType } from '../model/types';
import type { ExerciseSessionReportListResponseDTO } from './dto/exercise-session-report.dto';

export async function fetchExerciseSessionReportsFn(): Promise<ExerciseSessionReportListType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<ExerciseSessionReportListResponseDTO>(
    '/me/exercise-sessions/reports',
  );

  return response.data.data;
}
