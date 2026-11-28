'use client';
// app/admin/settings/page.jsx
import { useEffect, useState } from 'react';
import { Field } from '@/components/admin/Fields';
import { api } from '@/lib/api';
import { FONTS } from '@/lib/theme';

const GROUPS = [
  { title: 'Colors', hint: 'Applied across the whole website.', fields: [
    { k: 'colorPrimary', label: 'Accent color (floral line art)', type: 'color' },
    { k: 'colorBg', label: 'Page / About background (cream)', type: 'color' },
    { k: 'colorText', label: 'Text color', type: 'color' },
    { k: 'colorDark', label: 'Dark color (call-to-action band, menu)', type: 'color' },
  ] },
  { title: 'Fonts', hint: 'Heading and body text styles.', fields: [
    { k: 'fontDisplay', label: 'Heading font', type: 'font' },
    { k: 'fontBody', label: 'Body font', type: 'font' },
    { k: 'fontScript', label: 'Script font (Google Font name, e.g. Pinyon Script)' },
  ] },
  { title: 'Hero', hint: 'Press Enter to start a new line in the headline and script text.', fields: [
    { k: 'heroImage', label: 'Hero background photo', type: 'image', folder: 'site' },
    { k: 'heroOverlay', label: 'Left-side darkness (0 = none, 0.9 = very dark)' },
    { k: 'heroTitle', label: 'Headline', type: 'textarea' },
    { k: 'heroScript', label: 'Script tagline', type: 'textarea' },
    { k: 'heroSubtitle', label: 'Paragraph', type: 'textarea' },
    { k: 'heroBtn1', label: 'Button 1 text' }, { k: 'heroBtn1Href', label: 'Button 1 link, e.g. /collections' },
    { k: 'heroBtn2', label: 'Button 2 text (optional)' }, { k: 'heroBtn2Href', label: 'Button 2 link' },
  ] },
  { title: 'About section', fields: [
    { k: 'aboutImage', label: 'About photo', type: 'image', folder: 'site' },
    { k: 'aboutEyebrow', label: 'Small label above heading' },
    { k: 'aboutTitle', label: 'Heading' },
    { k: 'about', label: 'Paragraph', type: 'textarea' },
    { k: 'aboutScript', label: 'Script line' },
    { k: 'aboutBtnText', label: 'Button text' }, { k: 'aboutBtnHref', label: 'Button link, e.g. /about' },
  ] },
  { title: 'Bottom call-to-action band', fields: [
    { k: 'ctaTitle', label: 'Heading' }, { k: 'ctaSub', label: 'Sub text' },
    { k: 'bookText', label: 'Button text (also used in the menu)' },
    { k: 'bookHref', label: 'Button link, e.g. /measurements' },
  ] },
  { title: 'Contact section (home page)', hint: 'The address, hours, phone and email come from Studio details below.', fields: [
    { k: 'contactEyebrow', label: 'Small label above heading' },
    { k: 'contactTitle', label: 'Heading' },
    { k: 'contactText', label: 'Intro text', type: 'textarea' },
    { k: 'mapEmbed', label: 'Map embed (Google Maps > Share > Embed a map > paste the iframe code or its src link)', type: 'textarea' },
    { k: 'contactImage', label: 'Photo instead of map (used only if no map is set)', type: 'image', folder: 'site' },
    { k: 'directionsText', label: 'Directions button text' },
    { k: 'whatsappBtnText', label: 'WhatsApp button text' },
  ] },
  { title: 'Studio details', fields: [
    { k: 'storeName', label: 'Studio name' }, { k: 'tagline', label: 'Tagline (browser title)' },
    { k: 'address', label: 'Studio address', type: 'textarea' }, { k: 'hours', label: 'Opening hours' },
    { k: 'phone', label: 'Phone number' }, { k: 'whatsapp', label: 'WhatsApp number (with country code)' },
    { k: 'email', label: 'Email' }, { k: 'mapUrl', label: 'Google Maps link' },
    { k: 'instagram', label: 'Instagram link' }, { k: 'facebook', label: 'Facebook link' },
    { k: 'waText', label: 'WhatsApp pre-filled message', type: 'textarea' },
  ] },
  { title: 'Footer', hint: 'Footer colors follow the Dark color above. Leave the credit blank to hide it.', fields: [
    { k: 'footerAbout', label: 'Text under the logo', type: 'textarea' },
    { k: 'footerExploreTitle', label: 'Links column heading' },
    { k: 'footerContactTitle', label: 'Contact column heading' },
    { k: 'footerCredit', label: 'Credit line (bottom right)' },
  ] },
];

const row = { display: 'grid', gap: 6, marginBottom: 14 };
const divider = { ...row, paddingBottom: 14, borderBottom: '1px solid rgba(0,0,0,.1)' };

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
  // generic helpers for list-type settings (tiles, gallery, nav links)
  const setItem = (list, i, k, v) => set(list, (form[list] || []).map((t, j) => (j === i ? { ...t, [k]: v } : t)));
  const setStr = (list, i, v) => set(list, (form[list] || []).map((t, j) => (j === i ? v : t)));
  const remove = (list, i) => set(list, (form[list] || []).filter((_, j) => j !== i));
  const add = (list, item) => set(list, [...(form[list] || []), item]);

  async function save(e) {
    e.preventDefault(); setBusy(true); setErr(''); setMsg('');
    try { await api('/api/settings', 'PUT', form); setMsg('Settings saved. The website is updated.'); } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  if (!form) return err ? <div className="alert">{err}</div> : <p>Loading...</p>;

  const tiles = form.coupleTiles || [];
  const gallery = form.gallery || [];
  const navLinks = form.navLinks || [];
  const footerLinks = form.footerLinks || [];

  return (
    <>
      <h1>Site settings</h1>
      <p className="lead" style={{ marginBottom: 20 }}>Change the look, images and text of the website.</p>
      <form onSubmit={save} style={{ maxWidth: 760, display: 'grid', gap: 20 }}>

        <div className="card">
          <h2 style={{ marginBottom: 4 }}>Menu links</h2>
          <p style={{ marginBottom: 14, opacity: 0.7 }}>Up to 8 links shown in the top menu.</p>
          {navLinks.map((n, i) => (
            <div key={i} style={{ ...divider, gridTemplateColumns: '1fr 1fr auto', alignItems: 'center' }}>
              <input value={n.label || ''} onChange={(e) => setItem('navLinks', i, 'label', e.target.value)} placeholder="Label, e.g. Gallery" aria-label={`Menu link ${i + 1} label`} />
              <input value={n.href || ''} onChange={(e) => setItem('navLinks', i, 'href', e.target.value)} placeholder="Link, e.g. /gallery" aria-label={`Menu link ${i + 1} link`} />
              <button type="button" className="btn" onClick={() => remove('navLinks', i)}>Remove</button>
            </div>
          ))}
          {navLinks.length < 8 && <button type="button" className="btn" onClick={() => add('navLinks', { label: '', href: '/' })}>Add link</button>}
        </div>

        {GROUPS.slice(0, 3).map((g) => (
          <div className="card" key={g.title}>
            <h2 style={{ marginBottom: 4 }}>{g.title}</h2>
            {g.hint && <p style={{ marginBottom: 14, opacity: 0.7 }}>{g.hint}</p>}
            {g.fields.map((f) => (<Input key={f.k} f={f} value={form[f.k]} onChange={(v) => set(f.k, v)} />))}
          </div>
        ))}

        <div className="card">
          <h2 style={{ marginBottom: 4 }}>Picture cards (below the hero)</h2>
          <p style={{ marginBottom: 14, opacity: 0.7 }}>Up to 4 cards. Press Enter in the title to start a new line.</p>
          {tiles.map((t, i) => (
            <div key={i} style={divider}>
              <Field f={{ k: `tile${i}`, label: `Card ${i + 1} image`, type: 'image', folder: 'site' }} value={t.image} onChange={(v) => setItem('coupleTiles', i, 'image', v)} />
              <textarea rows={2} value={t.title || ''} onChange={(e) => setItem('coupleTiles', i, 'title', e.target.value)} placeholder="Title" aria-label={`Card ${i + 1} title`} />
              <textarea rows={2} value={t.text || ''} onChange={(e) => setItem('coupleTiles', i, 'text', e.target.value)} placeholder="Short text" aria-label={`Card ${i + 1} text`} />
              <input value={t.linkText || ''} onChange={(e) => setItem('coupleTiles', i, 'linkText', e.target.value)} placeholder="Arrow label for screen readers, e.g. View bridal wear" aria-label={`Card ${i + 1} link text`} />
              <input value={t.href || ''} onChange={(e) => setItem('coupleTiles', i, 'href', e.target.value)} placeholder="Link, e.g. /collections?audience=women" aria-label={`Card ${i + 1} link`} />
              <div><button type="button" className="btn" onClick={() => remove('coupleTiles', i)}>Remove card</button></div>
            </div>
          ))}
          {tiles.length < 4 && <button type="button" className="btn" onClick={() => add('coupleTiles', { image: '', title: '', text: '', linkText: 'View collection', href: '/collections' })}>Add card</button>}
        </div>

        {GROUPS.slice(3, 5).map((g) => (
          <div className="card" key={g.title}>
            <h2 style={{ marginBottom: 4 }}>{g.title}</h2>
            {g.fields.map((f) => (<Input key={f.k} f={f} value={form[f.k]} onChange={(v) => set(f.k, v)} />))}
          </div>
        ))}

        <div className="card">
          <h2 style={{ marginBottom: 4 }}>Photo strip</h2>
          <p style={{ marginBottom: 14, opacity: 0.7 }}>Up to 6 photos. Leave empty to use your product photos.</p>
          {gallery.map((src, i) => (
            <div key={i} style={divider}>
              <Field f={{ k: `gal${i}`, label: `Photo ${i + 1}`, type: 'image', folder: 'site' }} value={src} onChange={(v) => setStr('gallery', i, v)} />
              <div><button type="button" className="btn" onClick={() => remove('gallery', i)}>Remove photo</button></div>
            </div>
          ))}
          {gallery.length < 6 && <button type="button" className="btn" onClick={() => add('gallery', '')}>Add photo</button>}
        </div>

        {GROUPS.slice(5).map((g) => (
          <div className="card" key={g.title}>
            <h2 style={{ marginBottom: 14 }}>{g.title}</h2>
            {g.fields.map((f) => (<Input key={f.k} f={f} value={form[f.k]} onChange={(v) => set(f.k, v)} />))}
          </div>
        ))}

        <div className="card">
          <h2 style={{ marginBottom: 4 }}>Footer links</h2>
          <p style={{ marginBottom: 14, opacity: 0.7 }}>Up to 8 links in the footer.</p>
          {footerLinks.map((n, i) => (
            <div key={i} style={{ ...divider, gridTemplateColumns: '1fr 1fr auto', alignItems: 'center' }}>
              <input value={n.label || ''} onChange={(e) => setItem('footerLinks', i, 'label', e.target.value)} placeholder="Label" aria-label={`Footer link ${i + 1} label`} />
              <input value={n.href || ''} onChange={(e) => setItem('footerLinks', i, 'href', e.target.value)} placeholder="Link, e.g. /gallery" aria-label={`Footer link ${i + 1} link`} />
              <button type="button" className="btn" onClick={() => remove('footerLinks', i)}>Remove</button>
            </div>
          ))}
          {footerLinks.length < 8 && <button type="button" className="btn" onClick={() => add('footerLinks', { label: '', href: '/' })}>Add link</button>}
        </div>

        {err && <div className="alert" role="alert">{err}</div>}
        {msg && <div className="alert ok">{msg}</div>}
        <div><button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Save changes'}</button></div>
      </form>
    </>
  );
}