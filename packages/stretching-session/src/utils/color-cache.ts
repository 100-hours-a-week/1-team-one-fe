/**
 * 캐시 최적화를 포함한 색상 파싱 유틸리티.
 */

export type RgbaColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type SegmentationColor = string | RgbaColor;

const COLOR_CACHE = new Map<string, RgbaColor>();

/**
 * 사용자 정의 css 속성을 계산된 값으로 해석.
 */
const resolveCssColor = (value: string): string => {
  if (typeof window === 'undefined') return value;

  const trimmed = value.trim();
  const variableMatch = trimmed.match(/^var\((--[^)]+)\)$/);
  const variableName = variableMatch?.[1] ?? (trimmed.startsWith('--') ? trimmed : null);
  if (!variableName) return trimmed;

  const resolved = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  return resolved || trimmed;
};

/**
 * 알파 값을 0~255 범위로 정규화
 */
const normalizeAlpha = (value: number): number => {
  if (Number.isNaN(value)) return 255;
  if (value <= 1) return Math.round(value * 255);
  return Math.max(0, Math.min(255, Math.round(value)));
};

/**
 * rgba 정규화
 */
const normalizeColor = (color: RgbaColor): RgbaColor => {
  return {
    r: Math.max(0, Math.min(255, Math.round(color.r))),
    g: Math.max(0, Math.min(255, Math.round(color.g))),
    b: Math.max(0, Math.min(255, Math.round(color.b))),
    a: normalizeAlpha(color.a),
  };
};

/**
 * canvas 컨텍스트로 색상 문자열 파싱
 */
const parseColorImpl = (value: string, context: CanvasRenderingContext2D): RgbaColor | null => {
  context.fillStyle = value;
  const normalized = context.fillStyle.toString();

  // rgba rgb
  const rgbMatch = normalized.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)$/);
  if (rgbMatch) {
    const [, r, g, b, a] = rgbMatch;
    return normalizeColor({
      r: Number(r),
      g: Number(g),
      b: Number(b),
      a: a ? Number(a) : 1,
    });
  }

  // hex
  const hexMatch = normalized.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    const hex = hexMatch[1]!;
    const fullHex =
      hex.length === 3
        ? hex
            .split('')
            .map((char) => `${char}${char}`)
            .join('')
        : hex;
    const r = parseInt(fullHex.slice(0, 2), 16);
    const g = parseInt(fullHex.slice(2, 4), 16);
    const b = parseInt(fullHex.slice(4, 6), 16);
    return normalizeColor({ r, g, b, a: 255 });
  }

  return null;
};

/**
 * 캐시 활용 파싱
 *
 * 동일한 색상 재파싱을 방지하기 위해 Map 기반 캐시를 사용
 * @param value - 색상 값
 * @param context - 색상 파싱을 위한 canvas 2d
 * @returns 정규화된 rgba
 */
export function parseColor(
  value: SegmentationColor,
  context: CanvasRenderingContext2D,
): RgbaColor | null {
  if (typeof value !== 'string') {
    return normalizeColor(value);
  }

  const resolved = resolveCssColor(value);

  // 캐시 확인
  if (COLOR_CACHE.has(resolved)) {
    return COLOR_CACHE.get(resolved)!;
  }

  // 파싱 후 캐시에 저장
  const parsed = parseColorImpl(resolved, context);
  if (parsed) {
    COLOR_CACHE.set(resolved, parsed);
  }

  return parsed;
}

/**
 * 색상 캐시를 비웁니다.
 * 테스트 또는 동적 색상 갱신이 필요한 경우에 사용합니다.
 */
export function clearColorCache(): void {
  COLOR_CACHE.clear();
}

/**
 * 캐시 통계를 반환합니다(디버깅/모니터링용).
 */
export function getColorCacheStats(): { size: number; entries: string[] } {
  return {
    size: COLOR_CACHE.size,
    entries: Array.from(COLOR_CACHE.keys()),
  };
}
