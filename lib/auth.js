import { cookies } from 'next/headers';
import { COOKIE, verifyToken } from './jwt';

export async function isAdmin() {
  const t = cookies().get(COOKIE)?.value;
  return t ? verifyToken(t) : false;
}
