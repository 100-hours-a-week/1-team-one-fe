/**
 * @file create-accuracy-engine.ts
 * @description AI 기반 운동 정확도 평가 엔진
 *
 * 두 가지 운동 타입을 지원:
 * - REPS: 반복 운동 (스쿼트, 팔굽혀펴기 등) - 포즈 매칭 기반 phase 진행
 * - DURATION: 유지 운동 (플랭크, 스트레칭 등) - 포즈 매칭 + 시간 누적 기반
 *
 * 공통 흐름:
 * 1. 사용자 포즈 추출 (targetKeypoints 기준)
 * 2. visibility 필터링 (보이는 keypoint만 사용)
 * 3. 각 keyframe별 정확도 계산
 * 4. 타입별 로직 분기 (REPS / DURATION)
 *  - REPS:
 *  - DURATION:
 * 5. 결과 반환 (score, phase, progressRatio, counted)
 */

import type {
  AccuracyEngine,
  AccuracyEvaluateInput,
  AccuracyResult,
  CountedStatus,
  Landmark2D,
  ReferencePose,
  ReferenceKeyframe,
} from '../types';

/** 포즈가 일치한다고 판단하는 최소 점수 (0~100) */
const POSE_MATCH_THRESHOLD = 45;

/**
 * 정확도 평가 엔진 생성
 *
 * @returns AccuracyEngine - evaluate 메서드를 포함한 엔진 객체
 */
export function createAccuracyEngine(): AccuracyEngine {
  let lastTimestampMs: number | null = null;
  // DURATION용: 시간 델타 계산을 위한 이전 프레임 타임스탬프
  let lastFrameTimestampMs: number | null = null;

  // 점수 스무딩을 위한 상태
  let smoothedScore: number | null = null;
  const SCORE_SMOOTHING_FACTOR = 0.3; // 낮을수록 더 안정적

  /**
   * 점수에 Exponential Moving Average 적용하여 안정화
   */
  const smoothScore = (rawScore: number): number => {
    if (smoothedScore === null) {
      smoothedScore = rawScore;
    } else {
      // EMA: new = alpha * current + (1 - alpha) * previous
      smoothedScore =
        SCORE_SMOOTHING_FACTOR * rawScore + (1 - SCORE_SMOOTHING_FACTOR) * smoothedScore;
    }
    return smoothedScore;
  };

  /**
   * 정확도 평가 메인 함수
   *
   * @param input - 평가 입력 데이터
   * @returns AccuracyResult - 평가 결과 (score, phase, progressRatio, counted, meta)
   */
  const evaluate = (input: AccuracyEvaluateInput): AccuracyResult => {
    if (input.type === 'REPS') {
      // 1. deltaTime 계산 - 이전 프레임과의 시간 차이 계산 (첫 호출 시 0)
      const currentTime = input.frame.timestampMs;
      const deltaTimeMs = lastTimestampMs !== null ? currentTime - lastTimestampMs : 0; // 첫 호출
      lastTimestampMs = currentTime;

      // 2. 새 progressRatio 계산
      //    - REPS: "end" → "start" 전환 감지 시 0으로 리셋 (새 회차)
      //    - DURATION: 시간 경과에 따라 계속 증가
      let newProgressRatio: number;
      let phaseChanged = false;

      // REPS: "end" → "start" 전환 감지
      const willComplete = input.prevPhase === 'end' || input.progressRatio >= 0.95; // 거의 끝에 도달

      if (willComplete && input.prevPhase !== undefined) {
        // 새 회차 시작
        newProgressRatio = 0;
        phaseChanged = true;
      } else {
        const totalDurationMs = input.referencePose.totalDuration * 1000;
        const increment = deltaTimeMs / totalDurationMs;
        newProgressRatio = Math.min(input.progressRatio + increment, 1.0);
      }

      // 3. 현재 phase 결정
      //    - progressRatio 기준으로
      //    - referencePose의 phase 중 어디인지 찾기
      const currentPhase = getCurrentPhase(newProgressRatio, input.referencePose.keyframes);

      // 4. 기준 포즈 보간
      //    - progressRatio에 따라 인접 keyframe 사이를 선형 보간
      //    - referenceKeypoints: 현재 시점의 기준 포즈
      const referenceKeypoints = interpolateKeyframe(newProgressRatio, input.referencePose);

      // 5. 사용자 포즈 추출 - 전체 랜드마크 중 targetKeypoints 인덱스에 해당하는 것만 추출
      const userKeypoints = extractTargetKeypoints(
        input.frame.landmarks,
        input.referencePose.targetKeypoints,
      );

      // 6. visibility 필터링
      //    - threshold 이상인 keypoint 인덱스만 추출
      //    - visible한 keypoint가 3개 미만이면 정확도 측정 불가
      const visibleIndices = filterVisibleIndices(userKeypoints);
      if (visibleIndices.length < 3) {
        return {
          score: 0,
          phase: currentPhase,
          counted: 'NOT_INCREMENTED',
          progressRatio: newProgressRatio,
          meta: {
            warning: '정확도 측정 불가: 안보여용',
            visibleCount: visibleIndices.length,
          },
        };
      }

      // 7. 정확도 계산 - visible한 keypoint만으로 유클리드 거리 기반 유사도 산출
      const validPairs = visibleIndices
        .map((i) => ({ ref: referenceKeypoints[i], user: userKeypoints[i] }))
        .filter(
          (pair): pair is { ref: Landmark2D; user: Landmark2D } =>
            pair.ref !== undefined && pair.user !== undefined,
        );
      const visibleRef = validPairs.map((p) => p.ref);
      const visibleUser = validPairs.map((p) => p.user);
      const accuracy = calculateAccuracyRaw(visibleRef, visibleUser);

      // 8. counted 판단 - REPS 모드에서 "end" → "start" 전환이 감지되면 INCREMENTED
      let counted: CountedStatus = 'NOT_APPLICABLE';
      // phase 변화 재확인 (progressRatio 리셋 + phase 전환 둘 다 체크)
      const actualPhaseChanged =
        input.prevPhase !== undefined && input.prevPhase === 'end' && currentPhase === 'start';

      counted = phaseChanged || actualPhaseChanged ? 'INCREMENTED' : 'NOT_INCREMENTED';

      // 9. 결과 반환
      return {
        score: Math.round(accuracy),
        counted,
        progressRatio: newProgressRatio, // 다음 프레임 단계 전달용
        phase: currentPhase, // 다음 프레임 단계 전달용
        meta: {},
      };
    }

    const currentTime = input.frame.timestampMs;
    const totalDurationMs = input.referencePose.totalDuration * 1000;

    // 1. 사용자 포즈 추출
    const userKeypoints = extractTargetKeypoints(
      input.frame.landmarks,
      input.referencePose.targetKeypoints,
    );

    // 2. visibility 필터링
    const visibleIndices = filterVisibleIndices(userKeypoints);

    // 보이는 keypoint가 3개 미만이면 측정 불가
    if (visibleIndices.length < 3) {
      const currentPhase = input.prevPhase || input.referencePose.keyframes[0]?.phase || 'start';
      return {
        score: 0,
        phase: currentPhase,
        counted: 'NOT_APPLICABLE',
        progressRatio: input.progressRatio,
        meta: {
          warning: '정확도 측정 불가: 안보여용',
          visibleCount: visibleIndices.length,
        },
      };
    }

    // 3. 각 keyframe별 정확도 계산 (크기 보정 적용)
    // [변경] targetKeypoints 파라미터 추가 - 정렬에 필요
    const keyframes = input.referencePose.keyframes;
    const accuracyPerKeyframe = calculateAccuracyPerKeyframe(
      userKeypoints,
      keyframes,
      visibleIndices,
      input.referencePose.targetKeypoints, // [추가] 크기 보정용
    );

    // 결과값 초기화
    let newProgressRatio: number;
    let currentPhase: string;
    const counted: CountedStatus = 'NOT_APPLICABLE';
    let finalScore: number;

    // DURATION: 포즈 매칭 + 시간 누적 기반
    // 흐름: start → hold → end
    // - start: start 포즈 매칭 시 hold로 진행
    // - hold: hold 포즈 유지 시에만 시간 누적
    // - end: 누적 시간이 totalDuration 도달 시
    // - 점수: 현재 목표 phase의 정확도
    const prevPhase = input.prevPhase || keyframes[0]?.phase || 'start';

    // 시간 델타 계산
    const deltaMs = lastFrameTimestampMs !== null ? currentTime - lastFrameTimestampMs : 0;
    lastFrameTimestampMs = currentTime;

    // 누적 시간 (progressRatio에서 복원)
    let accumulatedTimeMs = input.progressRatio * totalDurationMs;

    // 각 phase별 정확도 조회
    const startAccuracy = accuracyPerKeyframe.find((a) => a.phase === 'start')?.accuracy ?? 0;
    const holdAccuracy = accuracyPerKeyframe.find((a) => a.phase === 'hold')?.accuracy ?? 0;

    if (prevPhase === 'start') {
      // start phase: start 포즈 매칭 시 hold로 진행
      if (startAccuracy >= POSE_MATCH_THRESHOLD) {
        currentPhase = 'hold';
      } else {
        currentPhase = 'start';
      }
      newProgressRatio = 0;
    } else if (prevPhase === 'hold') {
      // hold phase: hold 포즈 유지 시에만 시간 누적
      if (holdAccuracy >= POSE_MATCH_THRESHOLD) {
        accumulatedTimeMs += deltaMs;
      }

      newProgressRatio = Math.min(accumulatedTimeMs / totalDurationMs, 1.0);

      if (newProgressRatio >= 1.0) {
        currentPhase = 'end';
        newProgressRatio = 1.0;
      } else {
        currentPhase = 'hold';
      }
    } else {
      // end phase: 완료 상태 유지
      currentPhase = 'end';
      newProgressRatio = 1.0;
    }

    // 점수: 현재 목표 phase의 정확도
    finalScore = currentPhase === 'start' ? startAccuracy : holdAccuracy;

    // 점수 스무딩 및 결과 반환
    const smoothedFinalScore = smoothScore(finalScore);

    return {
      score: Math.round(smoothedFinalScore),
      counted,
      progressRatio: newProgressRatio,
      phase: currentPhase,
      meta: {},
    };
  };

  return { evaluate };
}

// ═══════════════════════════════════════════════════════════════════════════
// 유틸리티 함수
// ═══════════════════════════════════════════════════════════════════════════

/**
 * targetKeypoints 인덱스에 해당하는 keypoints만 추출
 *
 * @param landmarks - 전체 랜드마크 배열 (33개 등)
 * @param targetIndices - 추출할 인덱스 배열 (예: [0, 7, 8, 11, 12])
 * @returns 해당 인덱스의 keypoint 배열 (없으면 undefined)
 */
function extractTargetKeypoints(
  landmarks: ReadonlyArray<Landmark2D>,
  targetIndices: ReadonlyArray<number>,
): (Landmark2D | undefined)[] {
  return targetIndices.map((idx) => landmarks[idx]);
}

/**
 * visibility threshold 이상인 keypoint의 인덱스 목록 반환
 *
 * @param keypoints - keypoint 배열
 * @param threshold - visibility 임계값 (기본값: 0.4)
 * @returns 보이는 keypoint의 인덱스 배열
 *
 * @remarks
 * - visibility가 undefined인 경우 visible로 간주
 * - keypoint 자체가 undefined인 경우 제외
 */
function filterVisibleIndices(
  keypoints: (Landmark2D | undefined)[],
  threshold: number = 0.4,
): number[] {
  const indices: number[] = [];
  for (let i = 0; i < keypoints.length; i++) {
    const kp = keypoints[i];
    if (kp === undefined) continue;
    const v = kp.visibility;
    if (v === undefined || v >= threshold) {
      indices.push(i);
    }
  }
  return indices;
}

/**
 * 3D 유클리드 거리 기반 정확도 계산
 *
 * 계산 과정:
 * 1. 각 keypoint 쌍의 3D 거리: d = sqrt[(x1-x2)² + (y1-y2)² + (z1-z2)²]
 * 2. 평균 거리: D = Σd / n
 * 3. 유사도: similarity = exp(-D / tolerance)
 * 4. 점수: score = similarity × 100
 *
 * @param reference - 기준 포즈 keypoints
 * @param user - 사용자 포즈 keypoints
 * @param tolerance - 허용 오차 (기본값: 0.15, 클수록 관대한 평가)
 * @returns 정확도 점수 (0~100)
 */
function calculateAccuracy(
  reference: (Landmark2D | undefined)[],
  user: (Landmark2D | undefined)[],
  tolerance: number = 0.15,
  zWeight: number = 0.3,
): number {
  if (reference.length === 0 || reference.length !== user.length) {
    return 0;
  }

  let totalDistance = 0;
  let validPairCount = 0;

  for (let i = 0; i < reference.length; i++) {
    const ref = reference[i];
    const usr = user[i];

    if (ref === undefined || usr === undefined) continue;

    // z축에 가중치를 적용하여 영향력 축소
    const distance = Math.sqrt(
      Math.pow(ref.x - usr.x, 2) +
        Math.pow(ref.y - usr.y, 2) +
        zWeight * Math.pow(ref.z - usr.z, 2),
    );

    totalDistance += distance;
    validPairCount++;
  }

  if (validPairCount === 0) return 0;

  const avgDistance = totalDistance / validPairCount;
  const similarity = Math.exp(-avgDistance / tolerance);

  return similarity * 100;
}

function calculateAccuracyRaw(
  reference: Landmark2D[],
  user: Landmark2D[],
  tolerance: number = 0.15,
): number {
  if (reference.length === 0 || reference.length !== user.length) {
    return 0;
  }

  let totalDistance = 0;
  let validPairCount = 0;

  for (let i = 0; i < reference.length; i++) {
    const ref = reference[i];
    const usr = user[i];

    if (ref === undefined || usr === undefined) continue;

    const distance = Math.sqrt(
      Math.pow(ref.x - usr.x, 2) + Math.pow(ref.y - usr.y, 2) + Math.pow(ref.z - usr.z, 2),
    );

    totalDistance += distance;
    validPairCount++;
  }

  if (validPairCount === 0) return 0;

  const avgDistance = totalDistance / validPairCount;
  const similarity = Math.exp(-avgDistance / tolerance);

  return similarity * 100;
}

/**
 * 각도 및 상대 위치 기반 정확도 계산
 *
 * 측면 스트레칭 같은 비대칭 동작에서도 정확한 평가를 위해:
 * 1. 어깨 기울기 각도 비교
 * 2. 머리 위치 (어깨 중심 대비 상대 좌표, 어깨 너비로 정규화)
 * 3. 어깨 높이 차이 비율 비교
 *
 * @param reference - 기준 포즈 keypoints (targetKeypoints 순서)
 * @param user - 사용자 포즈 keypoints (targetKeypoints 순서)
 * @param targetKeypoints - 대상 keypoint 인덱스 배열
 * @param angleTolerance - 각도 허용 오차 (도, 기본값: 15도)
 * @param positionTolerance - 상대 위치 허용 오차 (정규화된 단위, 기본값: 0.3)
 * @returns 정확도 점수 (0~100)
 */
function calculateAngleBasedAccuracy(
  reference: (Landmark2D | undefined)[],
  user: (Landmark2D | undefined)[],
  targetKeypoints: ReadonlyArray<number>,
  angleTolerance: number = 15.0,
  positionTolerance: number = 0.3,
): number {
  // targetKeypoints에서 어깨 위치 찾기
  let leftShIdx: number | null = null;
  let rightShIdx: number | null = null;

  for (let i = 0; i < targetKeypoints.length; i++) {
    if (targetKeypoints[i] === 11) leftShIdx = i;
    if (targetKeypoints[i] === 12) rightShIdx = i;
  }

  // 어깨가 없으면 기존 방식으로 폴백
  if (leftShIdx === null || rightShIdx === null) {
    return calculateAccuracy(reference, user);
  }

  const refLeftSh = leftShIdx < reference.length ? reference[leftShIdx] : undefined;
  const refRightSh = rightShIdx < reference.length ? reference[rightShIdx] : undefined;
  const userLeftSh = leftShIdx < user.length ? user[leftShIdx] : undefined;
  const userRightSh = rightShIdx < user.length ? user[rightShIdx] : undefined;

  if (!refLeftSh || !refRightSh || !userLeftSh || !userRightSh) {
    return calculateAccuracy(reference, user);
  }

  // 어깨 중심 및 너비 계산
  const refCenterX = (refLeftSh.x + refRightSh.x) / 2;
  const refCenterY = (refLeftSh.y + refRightSh.y) / 2;
  const refWidth = Math.abs(refRightSh.x - refLeftSh.x);

  const userCenterX = (userLeftSh.x + userRightSh.x) / 2;
  const userCenterY = (userLeftSh.y + userRightSh.y) / 2;
  const userWidth = Math.abs(userRightSh.x - userLeftSh.x);

  const refScale = refWidth > 0.01 ? refWidth : 1.0;
  const userScale = userWidth > 0.01 ? userWidth : 1.0;

  const scores: number[] = [];
  const weights: number[] = [];

  // ─────────────────────────────────────────────────────────────────
  // 1. 어깨 기울기 각도 비교 (가중치: 30%)
  // ─────────────────────────────────────────────────────────────────
  const refShoulderAngle =
    (Math.atan2(refLeftSh.y - refRightSh.y, refLeftSh.x - refRightSh.x) * 180) / Math.PI;

  const userShoulderAngle =
    (Math.atan2(userLeftSh.y - userRightSh.y, userLeftSh.x - userRightSh.x) * 180) / Math.PI;

  const angleDiff = Math.abs(refShoulderAngle - userShoulderAngle);
  const angleScore = Math.max(0, 100 * (1 - angleDiff / angleTolerance));
  scores.push(angleScore);
  weights.push(0.3);

  // ─────────────────────────────────────────────────────────────────
  // 2. 어깨 높이 차이 비율 비교 (가중치: 10%)
  // ─────────────────────────────────────────────────────────────────
  const refShoulderHeightDiff = (refLeftSh.y - refRightSh.y) / refScale;
  const userShoulderHeightDiff = (userLeftSh.y - userRightSh.y) / userScale;

  const heightDiffError = Math.abs(refShoulderHeightDiff - userShoulderHeightDiff);
  const heightScore = Math.max(0, 100 * (1 - heightDiffError / positionTolerance));
  scores.push(heightScore);
  weights.push(0.1);

  // ─────────────────────────────────────────────────────────────────
  // 3. targetKeypoints 내 모든 키포인트의 상대 위치 비교 (가중치: 60%)
  // ─────────────────────────────────────────────────────────────────
  const keypointScores: number[] = [];

  for (let i = 0; i < targetKeypoints.length; i++) {
    const kpIdx = targetKeypoints[i]!;

    // 어깨 자체는 건너뜀 (이미 어깨 기울기/높이로 평가)
    if (kpIdx === 11 || kpIdx === 12) {
      continue;
    }

    const refKp = i < reference.length ? reference[i] : undefined;
    const userKp = i < user.length ? user[i] : undefined;

    if (!refKp || !userKp) {
      continue;
    }

    // 어깨 중심 대비 상대 위치 (어깨 너비로 정규화)
    const refRelX = (refKp.x - refCenterX) / refScale;
    const refRelY = (refKp.y - refCenterY) / refScale;
    const userRelX = (userKp.x - userCenterX) / userScale;
    const userRelY = (userKp.y - userCenterY) / userScale;

    const kpDiff = Math.sqrt(Math.pow(refRelX - userRelX, 2) + Math.pow(refRelY - userRelY, 2));
    const kpScore = Math.max(0, 100 * (1 - kpDiff / positionTolerance));
    keypointScores.push(kpScore);
  }

  if (keypointScores.length > 0) {
    const avgKpScore = keypointScores.reduce((a, b) => a + b, 0) / keypointScores.length;
    scores.push(avgKpScore);
    weights.push(0.6);
  }

  // ─────────────────────────────────────────────────────────────────
  // 가중 평균 계산
  // ─────────────────────────────────────────────────────────────────
  if (scores.length === 0) {
    return 0;
  }

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const weightedScore = scores.reduce((sum, s, i) => sum + s * weights[i]!, 0) / totalWeight;

  return weightedScore;
}

// ═══════════════════════════════════════════════════════════════════════════
// [추가] 크기 보정 (Alignment) 함수
// ═══════════════════════════════════════════════════════════════════════════
// 이유: 카메라와의 거리, 사용자의 체형에 따라 포즈 크기가 달라짐
// 어깨를 기준으로 X/Y 스케일을 맞춰 공정한 비교 가능
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 레퍼런스 포즈를 사용자 포즈에 맞게 정렬 (X/Y 개별 스케일 + 위치)
 *
 * - X축: 어깨 너비 (11, 12) 기준
 * - Y축: 어깨 중심에서 얼굴(코/귀)까지 거리 기준
 *
 * @param reference - 레퍼런스 keypoints (targetKeypoints 순서)
 * @param user - 사용자 keypoints (targetKeypoints 순서)
 * @param targetKeypoints - 대상 keypoint 인덱스 배열
 * @param visibilityThreshold - visibility 최소 임계값 (기본값: 0.5)
 * @returns 정렬된 레퍼런스 keypoints (정렬 불가 시 원본 반환)
 */
function alignKeypoints(
  reference: (Landmark2D | undefined)[],
  user: (Landmark2D | undefined)[],
  targetKeypoints: ReadonlyArray<number>,
  visibilityThreshold: number = 0.5,
): (Landmark2D | undefined)[] {
  // targetKeypoints에서 필요한 인덱스 찾기
  // key: MediaPipe 랜드마크 번호, value: targetKeypoints 배열 내 위치
  const landmarkIndices: Record<number, number | null> = {
    0: null, // nose
    7: null, // left ear
    8: null, // right ear
    11: null, // left shoulder
    12: null, // right shoulder
  };

  for (let i = 0; i < targetKeypoints.length; i++) {
    const kpIdx = targetKeypoints[i]!;
    if (kpIdx in landmarkIndices) {
      landmarkIndices[kpIdx] = i;
    }
  }

  const leftShoulderIdx = landmarkIndices[11];
  const rightShoulderIdx = landmarkIndices[12];

  // 어깨 데이터가 targetKeypoints에 없으면 원본 반환
  if (leftShoulderIdx == null || rightShoulderIdx == null) {
    return [...reference];
  }

  // 어깨 keypoints 가져오기
  const refLeftSh = reference[leftShoulderIdx];
  const refRightSh = reference[rightShoulderIdx];
  const userLeftSh = user[leftShoulderIdx];
  const userRightSh = user[rightShoulderIdx];

  // 어깨 데이터가 없으면 원본 반환
  if (!refLeftSh || !refRightSh || !userLeftSh || !userRightSh) {
    return [...reference];
  }

  // 레퍼런스 어깨 중심 및 너비
  const refCenterX = (refLeftSh.x + refRightSh.x) / 2;
  const refCenterY = (refLeftSh.y + refRightSh.y) / 2;
  const refWidth = Math.abs(refRightSh.x - refLeftSh.x);

  // 사용자 어깨 중심 및 너비
  const userCenterX = (userLeftSh.x + userRightSh.x) / 2;
  const userCenterY = (userLeftSh.y + userRightSh.y) / 2;
  const userWidth = Math.abs(userRightSh.x - userLeftSh.x);

  // X축 스케일 (어깨 너비 기준)
  const scaleX = refWidth > 0.01 ? userWidth / refWidth : 1.0;

  // Y축 스케일 (어깨-얼굴 거리 기준)
  let scaleY = scaleX; // 기본값: X축과 동일
  const faceYRef = getFaceYReference(reference, user, landmarkIndices, visibilityThreshold);

  if (faceYRef.refFaceY !== null && faceYRef.userFaceY !== null) {
    // 어깨 중심에서 얼굴까지의 수직 거리
    const refHeight = Math.abs(refCenterY - faceYRef.refFaceY);
    const userHeight = Math.abs(userCenterY - faceYRef.userFaceY);

    if (refHeight > 0.01) {
      scaleY = userHeight / refHeight;
    }
  }

  // 정렬된 keypoints 생성
  const aligned: (Landmark2D | undefined)[] = [];
  for (const kp of reference) {
    if (kp === undefined) {
      aligned.push(undefined);
      continue;
    }

    // 중심 기준 X/Y 개별 스케일 적용 후 사용자 중심으로 이동
    const newX = (kp.x - refCenterX) * scaleX + userCenterX;
    const newY = (kp.y - refCenterY) * scaleY + userCenterY;

    aligned.push({
      x: newX,
      y: newY,
      z: kp.z,
      visibility: kp.visibility,
    });
  }

  return aligned;
}

/**
 * 얼굴 Y 좌표 기준점 반환 (코 우선, 귀 중심 폴백)
 *
 * pose_alignment.py와 동일한 로직 사용 (화면 표시와 정확도 계산 일관성 유지)
 *
 * 우선순위:
 * 1. 코 (0)
 * 2. 귀 중심 (7, 8)
 *
 * @param reference - 레퍼런스 keypoints
 * @param user - 사용자 keypoints
 * @param landmarkIndices - 랜드마크 인덱스 매핑
 * @param visibilityThreshold - visibility 임계값
 * @returns { refFaceY, userFaceY } - 사용 가능한 랜드마크가 없으면 null
 */
function getFaceYReference(
  reference: (Landmark2D | undefined)[],
  user: (Landmark2D | undefined)[],
  landmarkIndices: Record<number, number | null>,
  visibilityThreshold: number,
): { refFaceY: number | null; userFaceY: number | null } {
  const noseIdx = landmarkIndices[0];
  const leftEarIdx = landmarkIndices[7];
  const rightEarIdx = landmarkIndices[8];

  // 각 랜드마크 가져오기
  const refNose = noseIdx != null ? reference[noseIdx] : undefined;
  const userNose = noseIdx != null ? user[noseIdx] : undefined;
  const refLeftEar = leftEarIdx != null ? reference[leftEarIdx] : undefined;
  const refRightEar = rightEarIdx != null ? reference[rightEarIdx] : undefined;
  const userLeftEar = leftEarIdx != null ? user[leftEarIdx] : undefined;
  const userRightEar = rightEarIdx != null ? user[rightEarIdx] : undefined;

  // visibility 체크 헬퍼
  const isUserVisible = (lm: Landmark2D | undefined): boolean => {
    if (!lm) return false;
    const v = lm.visibility;
    return v === undefined || v >= visibilityThreshold;
  };

  // 1순위: 코 (0)
  if (refNose && userNose && isUserVisible(userNose)) {
    return { refFaceY: refNose.y, userFaceY: userNose.y };
  }

  // 2순위: 귀 중심 (7, 8)
  if (
    refLeftEar &&
    refRightEar &&
    userLeftEar &&
    userRightEar &&
    isUserVisible(userLeftEar) &&
    isUserVisible(userRightEar)
  ) {
    const refEarY = (refLeftEar.y + refRightEar.y) / 2;
    const userEarY = (userLeftEar.y + userRightEar.y) / 2;
    return { refFaceY: refEarY, userFaceY: userEarY };
  }

  return { refFaceY: null, userFaceY: null };
}

/**
 * 각 keyframe에 대해 사용자 포즈와의 정확도 계산
 *
 * 하이브리드 방식:
 * 1. 정렬 기반 거리 계산 (목 스트레칭 등 어깨가 수평인 동작에 적합)
 * 2. 각도 기반 상대 위치 계산 (측면 스트레칭 등 어깨가 기울어진 동작에 적합)
 * 3. 두 방식 중 높은 점수 채택
 *
 * @param userKeypoints - 사용자 포즈 keypoints
 * @param keyframes - 레퍼런스 키프레임 배열
 * @param visibleIndices - 보이는 keypoint 인덱스 배열
 * @param targetKeypoints - 대상 keypoint 인덱스 배열
 * @returns 각 keyframe별 { phase, accuracy } 배열
 *
 * @remarks REPS, DURATION 모두에서 사용
 */
function calculateAccuracyPerKeyframe(
  userKeypoints: (Landmark2D | undefined)[],
  keyframes: ReadonlyArray<ReferenceKeyframe>,
  visibleIndices: number[],
  targetKeypoints: ReadonlyArray<number>,
): { phase: string; accuracy: number }[] {
  // target_keypoints에서 어깨 위치 찾기
  let leftShPos: number | null = null;
  let rightShPos: number | null = null;
  for (let i = 0; i < targetKeypoints.length; i++) {
    if (targetKeypoints[i] === 11) leftShPos = i;
    if (targetKeypoints[i] === 12) rightShPos = i;
  }

  return keyframes.map((keyframe) => {
    // 어깨가 visible_indices에 없으면 정확도 0
    if (
      (leftShPos !== null && !visibleIndices.includes(leftShPos)) ||
      (rightShPos !== null && !visibleIndices.includes(rightShPos))
    ) {
      return { phase: keyframe.phase, accuracy: 0 };
    }

    // 방법 1: 정렬 기반 거리 계산
    const alignedRef = alignKeypoints([...keyframe.keypoints], userKeypoints, targetKeypoints);
    const alignmentAccuracy = calculateAccuracy(alignedRef, userKeypoints);

    // 방법 2: 각도 기반 상대 위치 계산
    const angleAccuracy = calculateAngleBasedAccuracy(
      [...keyframe.keypoints],
      userKeypoints,
      targetKeypoints,
    );

    // 두 방식 중 높은 점수 채택
    const accuracy = Math.max(alignmentAccuracy, angleAccuracy);

    return { phase: keyframe.phase, accuracy };
  });
}

function getCurrentPhase(
  progressRatio: number,
  keyframes: ReadonlyArray<ReferenceKeyframe>,
): string {
  // 빈 배열 체크
  if (keyframes.length === 0) {
    return 'start';
  }

  const firstKeyframe = keyframes[0]!;
  const lastKeyframe = keyframes[keyframes.length - 1]!;

  // 첫 keyframe 이전
  if (progressRatio <= firstKeyframe.timestampRatio) {
    return firstKeyframe.phase;
  }
  // 마지막 keyframe 이후
  if (progressRatio >= lastKeyframe.timestampRatio) {
    return lastKeyframe.phase;
  }

  // 현재 위치한 구간 찾기
  for (let i = 0; i < keyframes.length - 1; i++) {
    const current = keyframes[i]!;
    const next = keyframes[i + 1]!;
    if (current.timestampRatio <= progressRatio && next.timestampRatio >= progressRatio) {
      // 구간의 중간점 기준으로 앞/뒤 phase 결정
      const midpoint = (current.timestampRatio + next.timestampRatio) / 2;
      return progressRatio < midpoint ? current.phase : next.phase;
    }
  }

  return firstKeyframe.phase;
}

/**
 * REPS 전용: 현재 phase에서 다음 phase 찾기
 *
 * keyframes 배열 순서대로 순차 진행
 * 예: start → quarter → peak → threeQuarter → end
 *
 * @param currentPhase - 현재 phase
 * @param keyframes - 레퍼런스 키프레임 배열
 * @returns 다음 phase (마지막이거나 없으면 null)
 */
function getNextRepsPhase(
  currentPhase: string,
  keyframes: ReadonlyArray<ReferenceKeyframe>,
): string | null {
  const currentIndex = keyframes.findIndex((kf) => kf.phase === currentPhase);
  if (currentIndex === -1 || currentIndex >= keyframes.length - 1) {
    return null;
  }
  return keyframes[currentIndex + 1]!.phase;
}

/**
 * REPS 전용: phase 인덱스를 기반으로 progressRatio 계산
 *
 * @param phase - 현재 phase
 * @param keyframes - 레퍼런스 키프레임 배열
 * @returns progressRatio (0~1)
 *
 * @example
 * // keyframes: [start, quarter, peak, threeQuarter, end]
 * getProgressRatioFromPhase('start', keyframes)        // 0.0
 * getProgressRatioFromPhase('quarter', keyframes)      // 0.25
 * getProgressRatioFromPhase('peak', keyframes)         // 0.5
 * getProgressRatioFromPhase('threeQuarter', keyframes) // 0.75
 * getProgressRatioFromPhase('end', keyframes)          // 1.0
 */
function getProgressRatioFromPhase(
  phase: string,
  keyframes: ReadonlyArray<ReferenceKeyframe>,
): number {
  const index = keyframes.findIndex((kf) => kf.phase === phase);
  if (index === -1 || keyframes.length <= 1) return 0;
  return index / (keyframes.length - 1);
}

/**
 * REPS 전용: 선형 보간으로 중간 포즈 keypoints 생성
 *
 * progressRatio에 따라 인접한 두 keyframe 사이를 선형 보간(lerp)하여
 * 연속적인 중간 포즈를 생성한다.
 *
 * @param progressRatio - 진행률 (0~1)
 * @param referencePose - 레퍼런스 포즈 데이터
 * @returns 보간된 keypoints 배열
 *
 * @remarks
 * DURATION에서는 사용하지 않음 (고정된 phase 포즈와 직접 비교)
 */
function interpolateKeyframe(progressRatio: number, referencePose: ReferencePose): Landmark2D[] {
  const keyframes = referencePose.keyframes;

  if (keyframes.length === 0) {
    return [];
  }

  const firstKeyframe = keyframes[0]!;
  const lastKeyframe = keyframes[keyframes.length - 1]!;

  // 범위 밖: 첫 번째 또는 마지막 keyframe 그대로 반환
  if (progressRatio <= firstKeyframe.timestampRatio) {
    return [...firstKeyframe.keypoints];
  }
  if (progressRatio >= lastKeyframe.timestampRatio) {
    return [...lastKeyframe.keypoints];
  }

  // 인접 keyframe 구간 찾기
  let prevFrame = firstKeyframe;
  let nextFrame = lastKeyframe;

  for (let i = 0; i < keyframes.length - 1; i++) {
    const current = keyframes[i]!;
    const next = keyframes[i + 1]!;
    if (current.timestampRatio <= progressRatio && next.timestampRatio >= progressRatio) {
      prevFrame = current;
      nextFrame = next;
      break;
    }
  }

  // 보간 비율 t (0~1)
  const t =
    (progressRatio - prevFrame.timestampRatio) /
    (nextFrame.timestampRatio - prevFrame.timestampRatio);

  // 각 keypoint를 선형 보간
  const interpolated: Landmark2D[] = [];
  for (let i = 0; i < prevFrame.keypoints.length; i++) {
    const prev = prevFrame.keypoints[i];
    const next = nextFrame.keypoints[i];

    if (prev === undefined || next === undefined) continue;

    interpolated.push({
      x: prev.x + (next.x - prev.x) * t,
      y: prev.y + (next.y - prev.y) * t,
      z: prev.z + (next.z - prev.z) * t,
      visibility: 1.0,
    });
  }

  return interpolated;
}
