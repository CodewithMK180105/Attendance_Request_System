// lib/jwt.ts
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export async function generateToken(payload: { email: string; role: string }) {
//   console.log('JWT: Generating token with secret:', (process.env.JWT_SECRET || 'your-secret-key').substring(0, 5) + '...');
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
  console.log('JWT: Token generated:', token.substring(0, 20) + '...');
  return token;
}

export async function verifyToken(token: string) {
  try {
    // console.log('JWT: Verifying token with secret:', (process.env.JWT_SECRET || 'your-secret-key').substring(0, 5) + '...');
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });
    // console.log('JWT: Token decoded:', payload);
    return payload as { email: string; role: string };
  } catch (error) {
    console.error('JWT: Verification error:', error);
    return null;
  }
}