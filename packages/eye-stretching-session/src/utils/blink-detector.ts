/**
 * @file blink-detector.ts
 * @description 눈 패치 밝기 기반 blink 감지기
 *
 * 알고리즘 (gaze-into-the-abyss/src/components/Abyss.tsx 포팅):
 *   1. eye patch ImageData에서 RGB 평균 밝기 계산 (4픽셀마다 샘플링)
 *   2. 좌/우 눈 밝기 평균
 *   3. 롤링 윈도우(기본 30프레임)의 평균을 개인별 기준선으로 사용
 *   4. 현재 밝기 > 기준선 × 1.2 → blink
 *      - 눈 뜸 → 어두운 동공 → 낮은 밝기
 *      - 눈 감음 → 밝은 눈꺼풀 → 높은 밝기 → threshold 초과
 *   5. 100ms debounce로 상태 전환 안정화
 */

export type BlinkDetectorOptions = {
  /** 롤링 평균 윈도우 크기 (기본: 30) */
  samplesSize?: number;
  /** 기준선 대비 배수, 이 값 초과 시 blink 판정 (기본: 1.2) */
  thresholdMultiplier?: number;
  /** 상태 전환 최소 간격 ms (기본: 100) */
  debounceMs?: number;
};

/** WebGazer tracker.getEyePatches() 반환값 최소 인터페이스 */
export type EyePatches = {
  left?: { patch?: ImageData } | null;
  right?: { patch?: ImageData } | null;
};

export type BlinkDetector = {
  /**
   * 눈 패치 ImageData로 blink 상태 판정
   *
   * @param patches - 좌/우 눈 ImageData
   * @param learn - true(기본): 밝기 샘플을 rolling window에 추가 (캘리브레이션 단계)
   *                false: rolling window 고정 (hold/close 단계에서 기준선 오염 방지)
   * @returns
   *   - `true`  : 현재 눈 감음
   *   - `false` : 현재 눈 뜸
   *   - `null`  : 패치 없음 또는 샘플 부족 (판정 불가)
   */
  update: (patches: EyePatches, learn?: boolean) => boolean | null;
  /** 내부 샘플 · 상태 초기화 */
  reset: () => void;
};

/**
 * Blink 감지기 생성
 *
 * 샘플이 2개 이상 쌓이기 전까지는 null을 반환한다.
 */
export function createBlinkDetector(options?: BlinkDetectorOptions): BlinkDetector {
  const { samplesSize = 30, thresholdMultiplier = 1.1, debounceMs = 100 } = options ?? {};

  const samples: number[] = [];
  let isCurrentlyBlinking = false;
  let lastBlinkTime = 0;
  let updateCallCount = 0;

  /** RGB 평균 밝기 계산 (4픽셀마다 샘플링으로 성능 최적화) */
  const calculateBrightness = (imageData: ImageData): number => {
    let total = 0;
    // i += 16 = RGBA 4채널 × 4픽셀 건너뜀
    for (let i = 0; i < imageData.data.length; i += 16) {
      const r = imageData.data[i] ?? 0;
      const g = imageData.data[i + 1] ?? 0;
      const b = imageData.data[i + 2] ?? 0;
      total += (r + g + b) / 3;
    }
    return total / ((imageData.width * imageData.height) / 4);
  };

  const update = (patches: EyePatches, learn = true): boolean | null => {
    if (!patches.right?.patch?.data || !patches.left?.patch?.data) {
      return null;
    }

    const rightBrightness = calculateBrightness(patches.right.patch);
    const leftBrightness = calculateBrightness(patches.left.patch);
    const avgBrightness = (rightBrightness + leftBrightness) / 2;

    // learn=true 일 때만 rolling window 업데이트 (follow 단계에서만 기준선 학습)
    if (learn) {
      if (samples.length >= samplesSize) {
        samples.shift();
      }
      samples.push(avgBrightness);
    }

    // 기준선 확보 전까지 판정 불가
    if (samples.length < 2) return null;

    const rollingAverage = samples.reduce((a, b) => a + b, 0) / samples.length;
    const dynamicThreshold = rollingAverage * thresholdMultiplier;
    const blinkDetected = avgBrightness > dynamicThreshold;

    updateCallCount += 1;
    if (updateCallCount % 30 === 0) {
      console.debug(`[blink-detector] #${updateCallCount}`, {
        avg: avgBrightness.toFixed(1),
        rollingAvg: rollingAverage.toFixed(1),
        threshold: dynamicThreshold.toFixed(1),
        blinkDetected,
        isCurrentlyBlinking,
        samples: samples.length,
      });
    }

    // debounce: 상태 전환 최소 간격 보장
    if (blinkDetected !== isCurrentlyBlinking) {
      const now = Date.now();
      if (now - lastBlinkTime > debounceMs) {
        isCurrentlyBlinking = blinkDetected;
        lastBlinkTime = now;
      }
    }

    return isCurrentlyBlinking;
  };

  const reset = (): void => {
    samples.length = 0;
    isCurrentlyBlinking = false;
    lastBlinkTime = 0;
    updateCallCount = 0;
  };

  return { update, reset };
}
