import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasRefreshToken = request.cookies.has('refreshToken');

  if (pathname.startsWith('/dashboard') && !hasRefreshToken) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (pathname.startsWith('/auth') && hasRefreshToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth'],
};
