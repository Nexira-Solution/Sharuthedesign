import { timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { COOKIE, signToken } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  const { password = '' } = await req.json().catch(() => ({}));
  const expected = process.env.ADMIN_PASSWORD || '';
  if (!expected || !process.env.JWT_SECRET)
    return NextResponse.json({ error: 'ADMIN_PASSWORD / JWT_SECRET missing in .env' }, { status: 500 });
  const a = Buffer.from(String(password)), b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b))
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await signToken(), {
    httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
