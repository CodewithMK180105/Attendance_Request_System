// lib/auth.ts
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function getUserFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    console.log('getUserFromCookies: No token found');
    return null;
  }

  const user = verifyToken(token);
//   console.log('getUserFromCookies: User:', user);
  return user;
}