// app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  console.log('API: Logout requested'); // Debug log
  const res = NextResponse.json({ success: true, message: 'Logged out' });

  res.cookies.set('auth_token', '', {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
    path: '/',
  });

  console.log('API: auth_token cookie cleared');
  return res;
}