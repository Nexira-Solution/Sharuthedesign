import { SignJWT, jwtVerify } from 'jose';

export const COOKIE = 'sharu_admin';
const key = () => new TextEncoder().encode(process.env.JWT_SECRET || '');

export async function signToken() {
  return new SignJWT({ role: 'admin' }).setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt().setExpirationTime('7d').sign(key());
}
export async function verifyToken(token) {
  try { await jwtVerify(token, key()); return true; } catch { return false; }
}
