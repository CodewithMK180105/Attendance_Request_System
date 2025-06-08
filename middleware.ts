// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  const cookies = request.cookies.getAll().map(cookie => [cookie.name, cookie.value] as [string, string]);

  const publicRoutes = ['/login', '/signup', '/api/sign-in', '/api/logout', '/_next', '/favicon.ico'];
  if (publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;
  let user: { email: string; role: string } | null = null;
  try {
    user = token ? await verifyToken(token) : null;
  } catch (error) {
    console.error('Middleware: Token verification failed:', error);
  }

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};