/**
 * uuid 추가
 * useId 는 사용 x
 */
export function createIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const timePart = Date.now().toString(16);
  const randomPart = Math.random().toString(16).slice(2);

  return `${timePart}-${randomPart}`;
}
