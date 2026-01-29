/**
 * 포즈 랜드마크 계산을 위한 기하 유틸리티
 *
 * - 정규화된 랜드마크를 캔버스 좌표로 변환
 * - 거리 및 크기 계산
 * - 본(랜드마크 간 연결선) 그리기
 */

import type { Landmark2D } from '@repo/stretching-accuracy';

/**
 * 랜드마크에서 visibility 값을 가져옴(없으면 1).
 */
export function getVisibility(landmark: Landmark2D): number {
  return landmark.visibility ?? 1;
}

/**
 * 정규화된 랜드마크(0~1)를 캔버스 픽셀 좌표로 변환
 *
 * @param landmark - x, y가 [0, 1] 범위인 정규화 랜드마크
 * @param width - 캔버스 너비(px)
 * @param height - 캔버스 높이(px)
 * @returns 캔버스 좌표 {x, y} / 랜드마크가 유효하지 않으면 null
 */
export function toCanvasPoint(
  landmark: Landmark2D | undefined,
  width: number,
  height: number,
): { x: number; y: number } | null {
  if (!landmark) return null;
  if (!Number.isFinite(landmark.x) || !Number.isFinite(landmark.y)) return null;

  const clampedX = Math.max(0, Math.min(1, landmark.x));
  const clampedY = Math.max(0, Math.min(1, landmark.y));

  return {
    x: clampedX * width,
    y: clampedY * height,
  };
}

/**
 * 어깨 너비를 픽셀 단위로 계산
 *
 * 머리 크기, 선 굵기 등 렌더링 스케일 계산에 사용
 * 어깨가 보이지 않으면 캔버스 너비의 8%로 대체
 *
 * @param landmarks - 포즈 랜드마크 배열
 * @param width - 캔버스 너비
 * @param height - 캔버스 높이
 * @returns 어깨 너비(px, 최소 8px)
 */
export function getShoulderWidth(
  landmarks: ReadonlyArray<Landmark2D>,
  width: number,
  height: number,
): number {
  const leftShoulder = toCanvasPoint(landmarks[11], width, height);
  const rightShoulder = toCanvasPoint(landmarks[12], width, height);

  if (!leftShoulder || !rightShoulder) {
    return Math.max(8, width * 0.08);
  }

  const dx = leftShoulder.x - rightShoulder.x;
  const dy = leftShoulder.y - rightShoulder.y;
  return Math.max(8, Math.sqrt(dx * dx + dy * dy));
}

/**
 * 두 랜드마크 사이의 선
 *
 * @param context - canvas 2d 렌더링 컨텍스트
 * @param landmarks - 포즈 랜드마크 배열
 * @param startIndex - 시작 랜드마크 인덱스
 * @param endIndex - 종료 랜드마크 인덱스
 * @param lineWidth - 선 두께
 * @param width - 캔버스 너비
 * @param height - 캔버스 높이
 */
export function drawBone(
  context: CanvasRenderingContext2D,
  landmarks: ReadonlyArray<Landmark2D>,
  startIndex: number,
  endIndex: number,
  lineWidth: number,
  width: number,
  height: number,
): void {
  const start = toCanvasPoint(landmarks[startIndex], width, height);
  if (!start) return;

  const end = toCanvasPoint(landmarks[endIndex], width, height);
  if (!end) return;

  context.lineWidth = lineWidth;
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.stroke();
}

/**
 * 두 캔버스 좌표 간 유클리드 거리 계산
 */
export function calculateDistance(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 두 캔버스 좌표의 중점 계산
 */
export function calculateMidpoint(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
): { x: number; y: number } {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}
