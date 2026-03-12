import { getHttpClient } from '@/src/shared/api';

import type { ExerciseSessionReportDetailType } from '../model/types';
import type { ExerciseSessionReportDetailResponseDTO } from './dto/exercise-session-report.dto';

export async function fetchExerciseSessionReportDetailFn(
  reportId: number,
): Promise<ExerciseSessionReportDetailType> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.get<ExerciseSessionReportDetailResponseDTO>(
    `/me/exercise-sessions/reports/${encodeURIComponent(reportId)}`,
  );

  return response.data.data;
}
