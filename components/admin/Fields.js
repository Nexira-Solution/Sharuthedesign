'use client';
import { useRef, useState } from 'react';
import Img from '../Img';

export async function uploadFile(file, folder) {
  const fd = new FormData();
  fd.append('file', file); fd.append('folder', folder);
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  const d = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(d.error || 'Upload failed');
  return d.url;
}

export function ImageUpload({ value, onChange, multiple = false, folder = 'general' }) {
  const ref = useRef();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const list = multiple ? (value || []) : value ? [value] : [];

  async function pick(e) {
    const files = [...e.target.files];
    e.target.value = '';
    if (!files.length) return;
    setBusy(true); setErr('');
    try {
      const urls = [];
      for (const f of files) urls.push(await uploadFile(f, folder));
      onChange(multiple ? [...list, ...urls] : urls[0]);
    } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  const remove = (i) => onChange(multiple ? list.filter((_, n) => n !== i) : '');

  return (
    <div>
      <div className="up-grid">
        {list.map((u, i) => (
          <div className="up" key={u + i}>
            <Img src={u} alt="" w={200} />
            <button type="button" onClick={() => remove(i)} aria-label="Remove image">&times;</button>
            {multiple && i === 0 && <em>Cover</em>}
          </div>
        ))}
        {(multiple || !list.length) && (
          <button type="button" className="up-add" onClick={() => ref.current.click()} disabled={busy}>{busy ? 'Uploading...' : '+ Add image'}</button>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" multiple={multiple} hidden onChange={pick} />
      {err && <div className="alert" role="alert">{err}</div>}
    </div>
  );
}

export function StepsEditor({ value = [], onChange }) {
  const set = (i, patch) => onChange(value.map((s, n) => (n === i ? { ...s, ...patch } : s)));
  const move = (i, d) => {
    const j = i + d; if (j < 0 || j >= value.length) return;
    const a = [...value]; [a[i], a[j]] = [a[j], a[i]]; onChange(a);
  };
  return (
    <div>
      {value.map((s, i) => (
        <div className="step-ed" key={i}>
          <div className="top">
            <strong>Measurement {i + 1}</strong>
            <span style={{ display: 'flex', gap: 6 }}>
              <button type="button" className="btn ghost sm" onClick={() => move(i, -1)} aria-label="Move up">Up</button>
              <button type="button" className="btn ghost sm" onClick={() => move(i, 1)} aria-label="Move down">Down</button>
              <button type="button" className="btn danger sm" onClick={() => onChange(value.filter((_, n) => n !== i))}>Remove</button>
            </span>
          </div>
          <div className="grid">
            <div>
              <div className="field"><label>Name (e.g. Neck, Chest, Sleeve Length)</label><input value={s.label} onChange={(e) => set(i, { label: e.target.value })} /></div>
              <div className="field"><label>How to measure</label><textarea value={s.instruction || ''} onChange={(e) => set(i, { instruction: e.target.value })} /></div>
              <div className="field"><label>Tip (optional)</label><input value={s.tip || ''} onChange={(e) => set(i, { tip: e.target.value })} /></div>
            </div>
            <div><label style={{ fontSize: '.9rem' }}>Instruction photo</label><ImageUpload value={s.image} onChange={(image) => set(i, { image })} folder="measurements" /></div>
          </div>
        </div>
      ))}
      <button type="button" className="btn ghost sm" onClick={() => onChange([...value, { label: '', instruction: '', tip: '', image: '' }])}>+ Add measurement</button>
    </div>
  );
}

export function Field({ f, value, onChange, options = [] }) {
  const id = `f-${f.k}`;
  if (f.type === 'checkbox')
    return <label className="check"><input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />{f.label}</label>;
  return (
    <div className="field">
      <label htmlFor={id}>{f.label}</label>
      {f.type === 'textarea' && <textarea id={id} value={value || ''} onChange={(e) => onChange(e.target.value)} />}
      {f.type === 'select' && (
        <select id={id} value={value || ''} onChange={(e) => onChange(e.target.value)}>
          {f.optional && <option value="">None</option>}
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )}
      {f.type === 'tags' && <input id={id} value={Array.isArray(value) ? value.join(', ') : ''} onChange={(e) => onChange(e.target.value.split(',').map((x) => x.trimStart()))} placeholder="Separate with commas" />}
      {f.type === 'image' && <ImageUpload value={value} onChange={onChange} folder={f.folder} />}
      {f.type === 'images' && <ImageUpload value={value} onChange={onChange} multiple folder={f.folder} />}
      {f.type === 'steps' && <StepsEditor value={value} onChange={onChange} />}
      {(!f.type || f.type === 'text' || f.type === 'number' || f.type === 'password') && (
        <input id={id} type={f.type || 'text'} value={value ?? ''} required={f.required} onChange={(e) => onChange(f.type === 'number' ? Number(e.target.value) : e.target.value)} />
      )}
      {f.hint && <span className="hint">{f.hint}</span>}
    </div>
  );
}
