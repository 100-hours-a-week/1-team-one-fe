// .../stretching-accuracy/src/engine/create-accuracy-engine.ts
// 일단 제가 이해하려고 주석을 구석구석 구구절절 달았는데 가독성이 좀 떨어지나요? 지울까요? ㅠㅠ

import type {
  AccuracyEngine,
  AccuracyEvaluateInput,
  AccuracyResult,
  CountedStatus,
  Landmark2D,
  ReferencePose,
  ReferenceKeyframe,
} from '../types';


/**
 * AI 정확도 평가 엔진 생성
 */
export function createAccuracyEngine(): AccuracyEngine {
  let lastTimestampMs: number | null = null;

  /**
   * @description ai 정확도 구현 로직
   * 입출력 타입은 types 폴더 참고
   * @param input AccuracyEvaluateInput (frame + referencePose + progressRatio)
   * @returns AccuracyResult (score + counted + progressRatio + phase + optional meta)
   */
  const evaluate = (input: AccuracyEvaluateInput): AccuracyResult => {
    // 1. deltaTime 계산 - 이전 프레임과의 시간 차이 계산 (첫 호출 시 0)
    const currentTime = input.frame.timestampMs;
    const deltaTimeMs = lastTimestampMs !== null
      ? currentTime - lastTimestampMs
      : 0; // 첫 호출
    lastTimestampMs = currentTime;

    // 2. 새 progressRatio 계산
    //    - REPS: "end" → "start" 전환 감지 시 0으로 리셋 (새 회차)
    //    - DURATION: 시간 경과에 따라 계속 증가
    let newProgressRatio: number;
    let phaseChanged = false;

    if (input.type === 'REPS') {
      // REPS: "end" → "start" 전환 감지
      const willComplete =
        input.prevPhase === 'end' ||
        input.progressRatio >= 0.95; // 거의 끝에 도달

      if (willComplete && input.prevPhase !== undefined) {
        // 새 회차 시작
        newProgressRatio = 0;
        phaseChanged = true;
      } else {
        const totalDurationMs = input.referencePose.totalDuration * 1000;
        const increment = deltaTimeMs / totalDurationMs;
        newProgressRatio = Math.min(input.progressRatio + increment, 1.0);
      }
    } else {
      // DURATION: 계속 증가
      const totalDurationMs = input.referencePose.totalDuration * 1000;
      const increment = deltaTimeMs / totalDurationMs;
      newProgressRatio = Math.min(input.progressRatio + increment, 1.0);
    }

    // 3. 현재 phase 결정
    //    - progressRatio 기준으로
    //    - referencePose의 phase 중 어디인지 찾기
    const currentPhase = getCurrentPhase(
      newProgressRatio,
      input.referencePose.keyframes
    );

    // 4. 기준 포즈 보간
    //    - progressRatio에 따라 인접 keyframe 사이를 선형 보간
    //    - referenceKeypoints: 현재 시점의 기준 포즈
    const referenceKeypoints = interpolateKeyframe(
      newProgressRatio,
      input.referencePose
    );

    // 5. 사용자 포즈 추출 - 전체 랜드마크 중 targetKeypoints 인덱스에 해당하는 것만 추출
    const userKeypoints = extractTargetKeypoints(
      input.frame.landmarks,
      input.referencePose.targetKeypoints
    );

    // 6. visibility 필터링
    //    - threshold 이상인 keypoint 인덱스만 추출
    //    - visible한 keypoint가 3개 미만이면 정확도 측정 불가
    const visibleIndices = filterVisibleIndices(userKeypoints);
    if (visibleIndices.length < 3) {
      return {
        score: 0,
        phase: currentPhase,
        counted: input.type === 'REPS' ? 'NOT_INCREMENTED' : 'NOT_APPLICABLE',
        progressRatio: newProgressRatio,
        meta: {
          warning: '정확도 측정 불가: 안보여용',
          visibleCount: visibleIndices.length,
        },
      };
    }

    // 7. 정확도 계산 - visible한 keypoint만으로 유클리드 거리 기반 유사도 산출
    const visibleRef = visibleIndices.map(i => referenceKeypoints[i]);
    const visibleUser = visibleIndices.map(i => userKeypoints[i]);
    const accuracy = calculateAccuracy(visibleRef, visibleUser);

    // 8. counted 판단 - REPS 모드에서 "end" → "start" 전환이 감지되면 INCREMENTED
    let counted: CountedStatus = 'NOT_APPLICABLE';
    if (input.type === 'REPS') {
      // phase 변화 재확인 (progressRatio 리셋 + phase 전환 둘 다 체크)
      const actualPhaseChanged =
        input.prevPhase !== undefined &&
        input.prevPhase === 'end' &&
        currentPhase === 'start';

      counted = (phaseChanged || actualPhaseChanged)
        ? 'INCREMENTED'
        : 'NOT_INCREMENTED';
    }

    // 9. 결과 반환
    return {
      score: Math.round(accuracy),
      counted,
      progressRatio: newProgressRatio, // 다음 프레임 단계 전달용
      phase: currentPhase,             // 다음 프레임 단계 전달용
      meta: {},
    };
  };

  return { evaluate };
}

/**
 * targetKeypoints 인덱스에 해당하는 keypoints만 추출
 */
function extractTargetKeypoints(
  landmarks: ReadonlyArray<Landmark2D>,
  targetIndices: ReadonlyArray<number>
): Landmark2D[] {
  return targetIndices.map(idx => landmarks[idx]);
}

/**
 * visibility가 threshold 이상인 keypoint의 인덱스 목록 반환
 * - visibility가 undefined인 경우 visible로 간주
 * threshold: 0.4 (기본값)
 */
function filterVisibleIndices(
  keypoints: Landmark2D[],
  threshold: number = 0.4
): number[] {
  const indices: number[] = [];
  for (let i = 0; i < keypoints.length; i++) {
    const v = keypoints[i].visibility;
    if (v === undefined || v >= threshold) {
      indices.push(i);
    }
  }
  return indices;
}

/**
 * 3D 유클리드 거리 기반 정확도 계산
 *
 * 1. 각 keypoint 쌍의 거리: d = sqrt[(x1-x2)^2 + ...]
 * 2. 평균 거리: D = sum(d) / n
 * 3. 유사도: similarity = exp(-D / tolerance)
 * 4. 점수: score = similarity * 100
 *
 * tolerance: 0.15 (기본값, 클수록 관대한 평가)
 */
function calculateAccuracy(
  reference: Landmark2D[],
  user: Landmark2D[],
  tolerance: number = 0.15
): number {
  if (reference.length === 0 || reference.length !== user.length) {
    return 0;
  }

  let totalDistance = 0;

  for (let i = 0; i < reference.length; i++) {
    const ref = reference[i];
    const usr = user[i];

    const distance = Math.sqrt(
      Math.pow(ref.x - usr.x, 2) +
      Math.pow(ref.y - usr.y, 2) +
      Math.pow(ref.z - usr.z, 2)
    );

    totalDistance += distance;
  }

  const avgDistance = totalDistance / reference.length;
  const similarity = Math.exp(-avgDistance / tolerance);

  return similarity * 100;
}

/**
 * progressRatio로 현재 어느 keyframe 구간인지 찾아서 phase 반환
 *
 * @description
 * - keyframes에 정의된 phase를 활용
 * - progressRatio에 따라 현재 구간의 phase 반환
 *
 * 예시:
 * - progressRatio = 0.3 → "quarter" 구간 → phase = "quarter"
 * - progressRatio = 0.6 → "threeQuarter" 구간 → phase = "threeQuarter"
 *
 * 구간의 중간점을 기준으로 앞/뒤 phase를 결정한다.
 */
function getCurrentPhase(
  progressRatio: number,
  keyframes: ReadonlyArray<ReferenceKeyframe>
): string {
  // Edge case: 첫 keyframe 이전
  if (progressRatio <= keyframes[0].timestampRatio) {
    return keyframes[0].phase;
  }
  // Edge case: 마지막 keyframe 이후
  if (progressRatio >= keyframes[keyframes.length - 1].timestampRatio) {
    return keyframes[keyframes.length - 1].phase;
  }

  // 현재 위치한 구간 찾기
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (keyframes[i].timestampRatio <= progressRatio &&
        keyframes[i + 1].timestampRatio >= progressRatio) {
      // 구간의 중간점 기준으로 앞/뒤 phase 결정
      const midpoint = (keyframes[i].timestampRatio + keyframes[i + 1].timestampRatio) / 2;
      return progressRatio < midpoint
        ? keyframes[i].phase
        : keyframes[i + 1].phase;
    }
  }

  return keyframes[0].phase;
}

/**
 * 선형 보간으로 기준 포즈 keypoints 계산
 *
 * progressRatio에 따라 인접한 두 keyframe 사이를
 * 선형 보간(lerp)하여 중간 포즈를 생성한다.
 */
function interpolateKeyframe(
  progressRatio: number,
  referencePose: ReferencePose
): Landmark2D[] {
  const keyframes = referencePose.keyframes;

  // 범위 밖: 첫 번째 또는 마지막 keyframe 그대로 반환
  if (progressRatio <= keyframes[0].timestampRatio) {
    return [...keyframes[0].keypoints];
  }
  if (progressRatio >= keyframes[keyframes.length - 1].timestampRatio) {
    return [...keyframes[keyframes.length - 1].keypoints];
  }

  // 인접 keyframe 구간 찾기
  let prevFrame = keyframes[0];
  let nextFrame = keyframes[keyframes.length - 1];

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (keyframes[i].timestampRatio <= progressRatio &&
        keyframes[i + 1].timestampRatio >= progressRatio) {
      prevFrame = keyframes[i];
      nextFrame = keyframes[i + 1];
      break;
    }
  }

  // 보간 비율 t (0~1)
  const t = (progressRatio - prevFrame.timestampRatio) /
            (nextFrame.timestampRatio - prevFrame.timestampRatio);

  // 각 keypoint를 선형 보간
  const interpolated: Landmark2D[] = [];
  for (let i = 0; i < prevFrame.keypoints.length; i++) {
    const prev = prevFrame.keypoints[i];
    const next = nextFrame.keypoints[i];

    interpolated.push({
      x: prev.x + (next.x - prev.x) * t,
      y: prev.y + (next.y - prev.y) * t,
      z: prev.z + (next.z - prev.z) * t,
      visibility: 1.0,
    });
  }

  return interpolated;
}
