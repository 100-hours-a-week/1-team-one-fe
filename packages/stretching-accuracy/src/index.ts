/**
 * NOTE: DURATION holdMs 동기화 관련 변경
 * - DURATION_MATCH_THRESHOLD export 추가
 * - 웹 앱에서 SUCCESS_ACCURACY_THRESHOLD로 사용
 */
export { createAccuracyEngine, DURATION_MATCH_THRESHOLD } from './engine/create-accuracy-engine';
export type {
  AccuracyEngine,
  AccuracyEvaluateInput,
  AccuracyResult,
  CountedStatus,
  ExerciseType,
  Landmark2D,
  PoseFrame,
  ReferenceKeyframe,
  ReferencePose,
} from './types';
