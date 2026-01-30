import type { Landmark2D, ReferenceKeyframe, ReferencePose } from '@repo/stretching-accuracy';

export type ReferencePoseParseError = 'INVALID_JSON' | 'INVALID_REFERENCE_POSE';

export type ReferencePoseParseResult =
  | { ok: true; value: ReferencePose }
  | { ok: false; error: ReferencePoseParseError };

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value);
};

const isString = (value: unknown): value is string => typeof value === 'string';

const isLandmark = (value: unknown): value is Landmark2D => {
  if (!isRecord(value)) return false;
  if (!isNumber(value.x)) return false;
  if (!isNumber(value.y)) return false;
  if (!isNumber(value.z)) return false;
  if (value.visibility === undefined) return true;
  return isNumber(value.visibility);
};

const isKeyframe = (value: unknown): value is ReferenceKeyframe => {
  if (!isRecord(value)) return false;
  if (!isString(value.phase)) return false;
  if (!isNumber(value.timestampRatio)) return false;
  if (!Array.isArray(value.keypoints)) return false;
  return value.keypoints.every(isLandmark);
};

const isReferencePose = (value: unknown): value is ReferencePose => {
  if (!isRecord(value)) return false;
  if (!Array.isArray(value.targetKeypoints)) return false;
  if (!value.targetKeypoints.every(isNumber)) return false;
  if (!Array.isArray(value.keyframes)) return false;
  if (!value.keyframes.every(isKeyframe)) return false;
  if (!isNumber(value.totalDuration)) return false;
  if (value.fpsHint === undefined) return true;
  return isNumber(value.fpsHint);
};

export function parseReferencePoseJson(value: string): ReferencePoseParseResult {
  if (value.trim().length === 0) {
    return { ok: false, error: 'INVALID_REFERENCE_POSE' };
  }

  try {
    const parsed: unknown = JSON.parse(value);
    if (!isReferencePose(parsed)) {
      return { ok: false, error: 'INVALID_REFERENCE_POSE' };
    }
    return { ok: true, value: parsed };
  } catch {
    return { ok: false, error: 'INVALID_JSON' };
  }
}
