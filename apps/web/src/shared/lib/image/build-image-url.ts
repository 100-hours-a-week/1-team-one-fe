/**
 * http:// 또는 https://
 */
export function isAbsoluteUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * 이미지 경로에 baseURL을 추가
 *
 * @param path - 이미지 경로
 * @param baseUrl - baseURL
 * @returns 완전한 이미지 URL
 */
export function buildImageUrl(path: string | null | undefined, baseUrl?: string): string {
  if (!path) {
    return '';
  }

  //이미 완성형인 경우 그대로 반환
  if (isAbsoluteUrl(path)) {
    return path;
  }

  //baseUrl이 없으면 환경변수 사용
  const resolvedBaseUrl = baseUrl ?? process.env.NEXT_PUBLIC_GCS_BASE_URL;

  //baseUrl도 없으면 경로만 반환
  if (!resolvedBaseUrl) {
    return path;
  }

  //baseUrl과 경로 병합 (중복 슬래시 제거)
  const cleanBaseUrl = resolvedBaseUrl.endsWith('/')
    ? resolvedBaseUrl.slice(0, -1)
    : resolvedBaseUrl;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  return `${cleanBaseUrl}/${cleanPath}`;
}

/**
 * 이미지 경로 배열을 URL 배열로 변환
 */
export function buildImageUrls(paths: string[] | null | undefined, baseUrl?: string): string[] {
  if (!paths || !Array.isArray(paths)) {
    return [];
  }

  return paths.map((path) => buildImageUrl(path, baseUrl));
}
