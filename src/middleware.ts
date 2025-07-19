// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/form'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  console.log('Middleware triggered for:', pathname);
  console.log('Protected route check:', isProtected);

  if (isProtected) {
    const token = req.cookies.get('auth_token')?.value;
    console.log('Auth token found:', token);

    if (!token) {
      console.log('No auth token, redirecting to login');
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}