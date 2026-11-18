'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function Login() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr('');
    try { await api('/api/auth/login', 'POST', { password }); router.push('/admin'); router.refresh(); }
    catch (x) { setErr(x.message); setBusy(false); }
  }
  return (
    <div className="login">
      <form onSubmit={submit}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-dark.png" alt="Sharu The Design Studio" />
        <div className="field"><label htmlFor="pw">Admin password</label>
          <input id="pw" type="password" autoFocus required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></div>
        {err && <div className="alert" role="alert">{err}</div>}
        <button className="btn" style={{ width: '100%' }} disabled={busy}>{busy ? 'Checking...' : 'Log in'}</button>
      </form>
    </div>
  );
}
