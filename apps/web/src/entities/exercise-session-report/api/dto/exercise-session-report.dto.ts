import type { ApiResponse } from '@/src/shared/api';

import type {
  ExerciseSessionReportDetailType,
  ExerciseSessionReportListType,
} from '../../model/types';

export type ExerciseSessionReportListResponseDTO = ApiResponse<ExerciseSessionReportListType>;

export type ExerciseSessionReportDetailResponseDTO = ApiResponse<ExerciseSessionReportDetailType>;
