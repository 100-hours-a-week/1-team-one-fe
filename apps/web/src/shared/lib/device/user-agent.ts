const normalizeUserAgent = (userAgent: string): string => userAgent.toLowerCase();

export function isIosUserAgent(userAgent: string): boolean {
  const normalized = normalizeUserAgent(userAgent);
  const isAppleMobile = /iphone|ipad|ipod/.test(normalized);
  const isIpadOs = /macintosh/.test(normalized) && /mobile/.test(normalized);

  return isAppleMobile || isIpadOs;
}

export function isMobileUserAgent(userAgent: string): boolean {
  const normalized = normalizeUserAgent(userAgent);

  if (isIosUserAgent(normalized)) {
    return true;
  }

  return /android/.test(normalized);
}
