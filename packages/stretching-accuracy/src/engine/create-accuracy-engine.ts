import type { AccuracyEngine, AccuracyResult, PoseFrame } from '../types';

/**
 * @description ai 정확도 구현 로직
 * 입출력 타입은 types 폴더 참고
 * @param _frame PoseFrame (2D landmarks + visibility)
 * @returns AccuracyResult (score + optional meta)
 */

const evaluate = (_frame: PoseFrame): AccuracyResult => {
  return { score: 0 };
};

export function createAccuracyEngine(): AccuracyEngine {
  return { evaluate };
}
