export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  path?: string;
  maxAge?: number;
}

export function serializeCookie(name: string, value: string, options: CookieOptions = {}): string {
  const encodedValue = encodeURIComponent(value);
  const parts = [`${name}=${encodedValue}`];

  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${options.maxAge}`);
  }

  if (options.path) {
    parts.push(`Path=${options.path}`);
  }

  if (options.httpOnly) {
    parts.push('HttpOnly');
  }

  if (options.secure) {
    parts.push('Secure');
  }

  if (options.sameSite) {
    const sameSiteValue = options.sameSite.charAt(0).toUpperCase() + options.sameSite.slice(1);
    parts.push(`SameSite=${sameSiteValue}`);
  }

  return parts.join('; ');
}
