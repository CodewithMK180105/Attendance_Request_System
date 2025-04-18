// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  console.log('Middleware: Processing request for:', request.nextUrl.pathname, 'URL:', request.url);
  // Transform cookies into [name, value] pairs
  const cookies = request.cookies.getAll().map(cookie => [cookie.name, cookie.value] as [string, string]);
//   console.log('Middleware: All cookies:', Object.fromEntries(cookies));

  // Skip middleware for public routes
  const publicRoutes = ['/login', '/signup', '/api/sign-in', '/api/logout', '/_next', '/favicon.ico'];
  if (publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    console.log('Middleware: Skipping public route:', request.nextUrl.pathname);
    return NextResponse.next();
  }

  // Get the token from cookies
  const token = request.cookies.get('auth_token')?.value;
//   console.log('Middleware: auth_token:', token || 'undefined');

//   console.log('Middleware: Token found:', !!token, 'Path:', request.nextUrl.pathname);
//   if (token) {
//     console.log('Middleware: Token value:', token.substring(0, 20) + '...');
//   } else {
//     console.log('Middleware: No auth_token cookie found');
//   }

  // Verify the token
  let user: { email: string; role: string } | null = null;
  try {
    user = token ? await verifyToken(token) : null;
    console.log('Middleware: User verified:', user);
  } catch (error) {
    console.error('Middleware: Token verification failed:', error);
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    console.log('Middleware: Redirecting to /login from:', request.nextUrl.pathname);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Proceed to the requested route
  console.log('Middleware: Allowing access to:', request.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};