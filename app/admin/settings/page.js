'use client';
// app/admin/settings/page.jsx
import { useEffect, useState } from 'react';
import { Field } from '@/components/admin/Fields';
import { api } from '@/lib/api';
import { FONTS } from '@/lib/theme';

const GROUPS = [
  { title: 'Colors', hint: 'Applied across the whole website.', fields: [
    { k: 'colorPrimary', label: 'Main color (buttons, links)', type: 'color' },
    { k: 'colorAccent', label: 'Accent color (ribbon)', type: 'color' },
    { k: 'colorBg', label: 'Page background', type: 'color' },
    { k: 'colorText', label: 'Text color', type: 'color' },
    { k: 'colorDark', label: 'Dark section color', type: 'color' },
  ] },
  { title: 'Fonts', hint: 'Heading and body text styles.', fields: [
    { k: 'fontDisplay', label: 'Heading font', type: 'font' },
    { k: 'fontBody', label: 'Body font', type: 'font' },
  ] },
  { title: 'Images', hint: 'Leave blank to use the default.', fields: [
    { k: 'heroImage', label: 'Home page hero background', type: 'image', folder: 'site' },
    { k: 'heroOverlay', label: 'Hero darkness (0 = none, 0.9 = very dark)' },
    { k: 'brideImage', label: 'Bride image', type: 'image', folder: 'site' },
    { k: 'groomImage', label: 'Groom image', type: 'image', folder: 'site' },
    { k: 'measureBg', label: 'Measurements section background', type: 'image', folder: 'site' },
  ] },
  { title: 'Home page hero', fields: [
    { k: 'heroTitle', label: 'Headline' },
    { k: 'heroSubtitle', label: 'Sub text', type: 'textarea' },
    { k: 'heroBtn1', label: 'Bride button text' }, { k: 'heroBtn2', label: 'Groom button text' },
    { k: 'tape', label: 'Ribbon words (separate with commas)', type: 'textarea' },
  ] },
  { title: 'Dressing the couple section', hint: 'Heading and background. Edit the picture cards in the box below.', fields: [
    { k: 'coupleTitle', label: 'Heading' }, { k: 'coupleSub', label: 'Sub text' },
    { k: 'coupleBg', label: 'Section background image (optional)', type: 'image', folder: 'site' },
  ] },
  { title: 'Home page sections', fields: [
    { k: 'brideTitle', label: 'Bride heading' }, { k: 'brideSub', label: 'Bride sub text' }, { k: 'brideTile', label: 'Bride tile text' },
    { k: 'groomTitle', label: 'Groom heading' }, { k: 'groomSub', label: 'Groom sub text' }, { k: 'groomTile', label: 'Groom tile text' },
    { k: 'measureTitle', label: 'Measurements heading' },
    { k: 'measureText', label: 'Measurements text', type: 'textarea' },
    { k: 'measureBtn', label: 'Measurements button text' },
    { k: 'visitTitle', label: 'Visit section heading' },
    { k: 'waText', label: 'WhatsApp pre-filled message', type: 'textarea' },
  ] },
  { title: 'Studio details', fields: [
    { k: 'storeName', label: 'Studio name' }, { k: 'tagline', label: 'Tagline (browser title)' },
    { k: 'about', label: 'About the studio', type: 'textarea' },
    { k: 'address', label: 'Studio address', type: 'textarea' }, { k: 'hours', label: 'Opening hours' },
    { k: 'phone', label: 'Phone number' }, { k: 'whatsapp', label: 'WhatsApp number (with country code)' },
    { k: 'email', label: 'Email' }, { k: 'mapUrl', label: 'Google Maps link' },
    { k: 'instagram', label: 'Instagram link' }, { k: 'facebook', label: 'Facebook link' },
  ] },
];

const row = { display: 'grid', gap: 6, marginBottom: 14 };

function Input({ f, value, onChange }) {
  if (f.type === 'color') {
    return (
      <div style={row}>
        <label>{f.label}</label>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input type="color" value={/^#[0-9a-f]{6}$/i.test(value || '') ? value : '#000000'} onChange={(e) => onChange(e.target.value)} aria-label={f.label} />
          <input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="#7a1f3d" style={{ maxWidth: 140 }} />
        </div>
      </div>
    );
  }
  if (f.type === 'font') {
    return (
      <div style={row}>
        <label>{f.label}</label>
        <select value={value || ''} onChange={(e) => onChange(e.target.value)} style={{ fontFamily: `'${value}', serif` }}>
          {FONTS.map((x) => (<option key={x} value={x}>{x}</option>))}
        </select>
      </div>
    );
  }
  return <Field f={f} value={value} onChange={onChange} />;
}

export default function Settings() {
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { api('/api/settings').then(setForm).catch((e) => setErr(e.message)); }, []);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const setTile = (i, k, v) => set('coupleTiles', (form.coupleTiles || []).map((t, j) => (j === i ? { ...t, [k]: v } : t)));
  const setStep = (i, k, v) => set('steps', form.steps.map((s, j) => (j === i ? { ...s, [k]: v } : s)));

  async function save(e) {
    e.preventDefault(); setBusy(true); setErr(''); setMsg('');
    try { await api('/api/settings', 'PUT', form); setMsg('Settings saved. The website is updated.'); } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  if (!form) return err ? <div className="alert">{err}</div> : <p>Loading...</p>;

  return (
    <>
      <h1>Site settings</h1>
      <p className="lead" style={{ marginBottom: 20 }}>Change the look, images and text of the website.</p>
      <form onSubmit={save} style={{ maxWidth: 760, display: 'grid', gap: 20 }}>
        {GROUPS.map((g) => (
          <div className="card" key={g.title}>
            <h2 style={{ marginBottom: 4 }}>{g.title}</h2>
            {g.hint && <p style={{ marginBottom: 14, opacity: 0.7 }}>{g.hint}</p>}
            {g.fields.map((f) => (<Input key={f.k} f={f} value={form[f.k]} onChange={(v) => set(f.k, v)} />))}
          </div>
        ))}

        <div className="card">
          <h2 style={{ marginBottom: 4 }}>Dressing the couple: picture cards</h2>
          <p style={{ marginBottom: 14, opacity: 0.7 }}>Up to 4 cards. Each has an image, title, text and a link.</p>
          {(form.coupleTiles || []).map((t, i) => (
            <div key={i} style={{ ...row, paddingBottom: 14, borderBottom: '1px solid rgba(0,0,0,.1)' }}>
              <Field f={{ k: `tile${i}`, label: `Card ${i + 1} image`, type: 'image', folder: 'site' }} value={t.image} onChange={(v) => setTile(i, 'image', v)} />
              <input value={t.title || ''} onChange={(e) => setTile(i, 'title', e.target.value)} placeholder="Title" aria-label={`Card ${i + 1} title`} />
              <textarea rows={2} value={t.text || ''} onChange={(e) => setTile(i, 'text', e.target.value)} placeholder="Short text" aria-label={`Card ${i + 1} text`} />
              <input value={t.linkText || ''} onChange={(e) => setTile(i, 'linkText', e.target.value)} placeholder="Link text, e.g. View bridal wear" aria-label={`Card ${i + 1} link text`} />
              <input value={t.href || ''} onChange={(e) => setTile(i, 'href', e.target.value)} placeholder="Link, e.g. /collections?audience=women" aria-label={`Card ${i + 1} link`} />
              <div><button type="button" className="btn" onClick={() => set('coupleTiles', form.coupleTiles.filter((_, j) => j !== i))}>Remove card</button></div>
            </div>
          ))}
          {(form.coupleTiles || []).length < 4 && (
            <button type="button" className="btn" onClick={() => set('coupleTiles', [...(form.coupleTiles || []), { image: '', title: '', text: '', linkText: 'View collection', href: '/collections' }])}>Add card</button>
          )}
        </div>

        <div className="card">
          <h2 style={{ marginBottom: 14 }}>Measurement steps</h2>
          {(form.steps || []).map((s, i) => (
            <div key={i} style={{ ...row, paddingBottom: 14, borderBottom: '1px solid rgba(0,0,0,.1)' }}>
              <input value={s.title} onChange={(e) => setStep(i, 'title', e.target.value)} placeholder="Step title" aria-label={`Step ${i + 1} title`} />
              <textarea rows={2} value={s.text} onChange={(e) => setStep(i, 'text', e.target.value)} placeholder="Step text" aria-label={`Step ${i + 1} text`} />
              <div>
                <button type="button" className="btn" onClick={() => set('steps', form.steps.filter((_, j) => j !== i))}>Remove step</button>
              </div>
            </div>
          ))}
          {(form.steps || []).length < 8 && (
            <button type="button" className="btn" onClick={() => set('steps', [...(form.steps || []), { title: '', text: '' }])}>Add step</button>
          )}
        </div>

        {err && <div className="alert" role="alert">{err}</div>}
        {msg && <div className="alert ok">{msg}</div>}
        <div><button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Save changes'}</button></div>
      </form>
    </>
  );
}