import { NextResponse } from 'next/server';
import { COOKIE, verifyToken } from './lib/jwt';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE)?.value;
  const ok = token ? await verifyToken(token) : false;
  if (pathname === '/admin/login') {
    return ok ? NextResponse.redirect(new URL('/admin', req.url)) : NextResponse.next();
  }
  return ok ? NextResponse.next() : NextResponse.redirect(new URL('/admin/login', req.url));
}
export const config = { matcher: ['/admin/:path*'] };
