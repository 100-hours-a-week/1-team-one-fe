import type { AccuracyEngine, AccuracyEvaluateInput, AccuracyResult } from '../types';

/**
 * @description ai 정확도 구현 로직
 * 입출력 타입은 types 폴더 참고
 * @param _input AccuracyEvaluateInput (frame + referencePose + progressRatio)
 * @returns AccuracyResult (score + optional meta)
 */

const evaluate = (_input: AccuracyEvaluateInput): AccuracyResult => {
  return { score: 0 };
};

export function createAccuracyEngine(): AccuracyEngine {
  return { evaluate };
}
