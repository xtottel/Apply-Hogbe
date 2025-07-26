import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/form'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected) {
    const authToken = req.cookies.get('auth_token')?.value;
    const isAuthenticated = req.cookies.get('authenticated')?.value === 'true';

    console.log('Middleware check:', {
      pathname,
      authTokenExists: !!authToken,
      isAuthenticated
    });

    if (!authToken || !isAuthenticated) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}