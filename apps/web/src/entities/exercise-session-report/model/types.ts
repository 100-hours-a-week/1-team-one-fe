export type ExerciseSessionReportExerciseType = 'REPS' | 'DURATION' | 'EYES';

export type ExerciseSessionReportExerciseTypeValue =
  | ExerciseSessionReportExerciseType
  | (string & {});

export type ExerciseSessionReportStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';

export type ExerciseSessionReportStatusValue = ExerciseSessionReportStatus | (string & {});

export interface ExerciseSessionReportListItemType {
  sessionReportId: number;
  createdAt: string;
}

export interface ExerciseSessionReportListType {
  reports: ReadonlyArray<ExerciseSessionReportListItemType>;
}

export interface ExerciseSessionReportExerciseResultType {
  exerciseId: number;
  exerciseName: string;
  exerciseType: ExerciseSessionReportExerciseTypeValue;
  stepOrder: number;
  status: ExerciseSessionReportStatusValue;
  accuracy: number | null;
}

export interface ExerciseSessionReportRewardsType {
  level: number;
  previousExp: number;
  earnedExp: number;
  streak: number;
  previousStatusScore: number;
  earnedStatusScore: number;
}

export interface ExerciseSessionReportDetailType {
  sessionReportId: number;
  createdAt: string;
  isRoutineCompleted: boolean;
  exercises: ReadonlyArray<ExerciseSessionReportExerciseResultType>;
  rewards: ExerciseSessionReportRewardsType;
}
