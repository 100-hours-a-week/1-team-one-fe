export const IGNORE_ERROR_MESSAGES = ['ResizeObserver loop limit exceeded'];

export const IGNORE_SCRIPT_ERROR_SUBSTRINGS = ['Script error.'];

export function maskUrlQuery(url: string) {
  try {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://dummy.base';

    const u = new URL(url, base);

    ['token', 'access_token', 'refresh_token', 'code'].forEach((k) => u.searchParams.delete(k));

    // dummy.base를 breadcrumb에 남기지 않도록 처리
    if (base === 'https://dummy.base') return u.pathname + u.search + u.hash;

    // base가 실제 origin이면 그대로 반환
    return u.toString();
  } catch {
    return url;
  }
}
