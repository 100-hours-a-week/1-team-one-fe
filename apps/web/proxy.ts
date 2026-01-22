import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { AUTH_CONFIG } from '@/src/shared/config/auth';
import { ROUTES } from '@/src/shared/routes';

const PROTECTED_PREFIX = '/app';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get(AUTH_CONFIG.REFRESH_TOKEN_COOKIE)?.value;
  const hasRefreshToken = !!refreshToken;

  console.log('Proxy middleware triggered for path:', refreshToken);

  if (!hasRefreshToken && pathname.startsWith(PROTECTED_PREFIX)) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.LOGIN;
    return NextResponse.redirect(url);
  }

  if (hasRefreshToken && (pathname === ROUTES.LOGIN || pathname === ROUTES.SIGNUP)) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.MAIN;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

//TODO: matcher 상세화
export const config = {
  matcher: ['/app/:path*', '/login', '/signup', '/onboarding/:path*'],
};
