'use client';
import { useEffect, useState } from 'react';
import { Field } from '@/components/admin/Fields';
import { api } from '@/lib/api';

const fields = [
  { k: 'storeName', label: 'Studio name' }, { k: 'tagline', label: 'Tagline' },
  { k: 'heroTitle', label: 'Home page headline' }, { k: 'heroSubtitle', label: 'Home page sub text', type: 'textarea' },
  { k: 'heroImage', label: 'Home page hero image (optional)', type: 'image', folder: 'site' },
  { k: 'about', label: 'About the studio', type: 'textarea' },
  { k: 'address', label: 'Studio address', type: 'textarea' }, { k: 'hours', label: 'Opening hours' },
  { k: 'phone', label: 'Phone number' }, { k: 'whatsapp', label: 'WhatsApp number (with country code)' },
  { k: 'email', label: 'Email' }, { k: 'mapUrl', label: 'Google Maps link' },
  { k: 'instagram', label: 'Instagram link' }, { k: 'facebook', label: 'Facebook link' },
];

export default function Settings() {
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { api('/api/settings').then(setForm).catch((e) => setErr(e.message)); }, []);

  async function save(e) {
    e.preventDefault(); setBusy(true); setErr(''); setMsg('');
    try { await api('/api/settings', 'PUT', form); setMsg('Settings saved. The website is updated.'); } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  if (!form) return err ? <div className="alert">{err}</div> : <p>Loading...</p>;
  return (
    <>
      <h1>Site settings</h1><p className="lead" style={{ marginBottom: 20 }}>Studio details shown on the website.</p>
      <form className="card" onSubmit={save} style={{ maxWidth: 760 }}>
        {fields.map((f) => <Field key={f.k} f={f} value={form[f.k]} onChange={(v) => setForm({ ...form, [f.k]: v })} />)}
        {err && <div className="alert" role="alert">{err}</div>}
        {msg && <div className="alert ok">{msg}</div>}
        <button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Save changes'}</button>
      </form>
    </>
  );
}
