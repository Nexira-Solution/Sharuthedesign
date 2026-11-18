'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  AlertTriangle,
  Check,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import Img from '../Img';
import { Field } from './Fields';
import { api } from '@/lib/api';

export default function CrudManager({
  title,
  hint,
  endpoint,
  fields,
  defaults = {},
  row,
  singular,
  filterTabs,
  filterFn,
}) {
  const [items, setItems] = useState([]);
  const [opts, setOpts] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [activeTab, setActiveTab] = useState(filterTabs?.[0]?.id || 'all');
  const [search, setSearch] = useState('');

  // Custom Delete Confirmation Card State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await api(`${endpoint}?limit=500`));
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    load();
    fields
      .filter((f) => f.optionsFrom)
      .forEach(async (f) => {
        try {
          const d = await api(f.optionsFrom);
          setOpts((o) => ({
            ...o,
            [f.k]: d.map((x) => ({ value: x._id, label: x.name || x.title })),
          }));
        } catch {}
      });
  }, [load, fields]);

  const openForm = (item) => {
    setErr('');
    if (item === 'new') {
      setForm({ ...defaults });
    } else {
      const f = { ...item };
      fields
        .filter((x) => x.optionsFrom)
        .forEach((x) => {
          f[x.k] = item[x.k]?._id || item[x.k] || '';
        });
      setForm(f);
    }
    setEditing(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setEditing(null);
    setErr('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setErr('');
    try {
      const body = { ...form };
      fields.forEach((f) => {
        if (f.optionsFrom && !body[f.k]) body[f.k] = null;
        if (f.type === 'tags') body[f.k] = (body[f.k] || []).map((x) => x.trim()).filter(Boolean);
      });
      if (editing === 'new') await api(endpoint, 'POST', body);
      else await api(`${endpoint}/${editing._id}`, 'PUT', body);
      closeForm();
      await load();
    } catch (x) {
      setErr(x.message);
    } finally {
      setSaving(false);
    }
  }

  // Confirm delete handler
  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api(`${endpoint}/${deleteTarget._id}`, 'DELETE');
      setDeleteTarget(null);
      if (editing && editing._id === deleteTarget._id) {
        setEditing(null);
      }
      await load();
    } catch (x) {
      setErr(x.message);
    } finally {
      setDeleting(false);
    }
  }

  // Filter items
  const filtered = items.filter((it) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        (it.name || '').toLowerCase().includes(q) ||
        (it.title || '').toLowerCase().includes(q) ||
        (it.fabric || '').toLowerCase().includes(q) ||
        (it.description || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filterFn) {
      return filterFn(it, activeTab);
    }
    return true;
  });

  const isFormOpen = editing !== null;

  /* ==========================================================
     FULL-PAGE FORM VIEW (WHEN ADD OR EDIT IS CLICKED)
     Occupies 100% of available content area, hides listing
     ========================================================== */
  if (isFormOpen) {
    return (
      <div className="full-page-form-wrapper">
        {/* Full-Page Form Header Navigation */}
        <div className="full-page-form-header">
          <button
            type="button"
            className="full-page-back-btn"
            onClick={closeForm}
          >
            <ArrowLeft size={18} /> Back to {title}
          </button>

          <div className="full-page-title-block">
            <h1>{editing === 'new' ? `Add New ${singular}` : `Edit ${singular}`}</h1>
            <p className="lead">
              {editing === 'new'
                ? `Fill out the details below to create a new ${singular.toLowerCase()} in your studio catalog.`
                : `Update configuration and details for "${editing.name || editing.title}".`}
            </p>
          </div>
        </div>

        {/* Full-Page Form Container */}
        <form className="full-page-form-card" onSubmit={save}>
          {err && <div className="alert" role="alert">{err}</div>}

          <div className="full-page-form-fields">
            {fields.map((f) => (
              <Field
                key={f.k}
                f={f}
                value={form[f.k]}
                options={f.options || opts[f.k] || []}
                onChange={(v) => setForm((s) => ({ ...s, [f.k]: v }))}
              />
            ))}
          </div>

          <div className="full-page-form-actions">
            <button type="button" className="btn ghost" onClick={closeForm}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="spin" size={16} /> Saving {singular}...
                </>
              ) : (
                <>
                  <Check size={16} /> {editing === 'new' ? `Create ${singular}` : 'Save Changes'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  /* ==========================================================
     FULL LISTING VIEW (WHEN NOT IN EDIT/ADD MODE)
     ========================================================== */
  return (
    <div className="crud-listing-wrapper">
      {/* Top Action Bar */}
      <div className="adm-bar">
        <div>
          <h1>{title}</h1>
          {hint && <p className="lead">{hint}</p>}
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => openForm('new')}
        >
          <Plus size={16} /> Add {singular}
        </button>
      </div>

      {err && <div className="alert" role="alert">{err}</div>}

      {/* Filters & Search */}
      {(filterTabs?.length > 0 || items.length > 5) && (
        <div className="adm-filter-bar">
          {filterTabs?.length > 0 && (
            <div className="filters" style={{ margin: '0 0 10px' }}>
              {filterTabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`chip sm ${activeTab === t.id ? 'on' : ''}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}

          <div className="adm-search-row">
            <div className="search-input-wrapper">
              <Search size={15} className="search-icon-inline" />
              <input
                type="text"
                placeholder={`Search ${title.toLowerCase()}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="adm-search-input"
              />
              {search && (
                <button type="button" className="adm-clear-search" onClick={() => setSearch('')}>
                  ✕
                </button>
              )}
            </div>
            <span className="adm-count-badge">
              <strong>{filtered.length}</strong> of {items.length}
            </span>
          </div>
        </div>
      )}

      {/* List Items */}
      {loading ? (
        <div className="loading-box">
          <Loader2 className="spin" size={24} />
          <p>Loading {title.toLowerCase()}...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          {items.length === 0
            ? `No ${title.toLowerCase()} yet. Click "Add ${singular}" above to create the first one.`
            : 'No items match your filter criteria.'}
        </div>
      ) : (
        <div className="list">
          {filtered.map((it) => {
            const r = row(it);

            return (
              <div className="row" key={it._id}>
                <div className="th">
                  <Img src={r.thumb} alt="" w={150} />
                </div>
                <div className="row-content">
                  <div className="row-title-line">
                    <h3>{r.title}</h3>
                    {r.badge && <span className="badge ok">{r.badge}</span>}
                  </div>
                  <p>{r.meta}</p>
                </div>
                <div className="acts">
                  <button
                    type="button"
                    className="btn ghost sm"
                    onClick={() => openForm(it)}
                    title={`Edit ${singular}`}
                  >
                    <Edit2 size={13} style={{ display: 'inline', marginRight: 4 }} /> Edit
                  </button>
                  <button
                    type="button"
                    className="btn danger sm"
                    onClick={() => setDeleteTarget(it)}
                    title={`Delete ${singular}`}
                  >
                    <Trash2 size={13} style={{ display: 'inline', marginRight: 4 }} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CUSTOM CONFIRM DELETE CARD DIALOG (NO BROWSER POPUP) */}
      {deleteTarget && (
        <div className="delete-modal-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="delete-confirm-card" onClick={(e) => e.stopPropagation()}>
            <div className="delete-card-icon-wrap">
              <AlertTriangle size={32} className="delete-warning-icon" />
            </div>

            <div className="delete-card-content">
              <h3>Delete {singular}?</h3>
              <p className="delete-card-name">
                &ldquo;<strong>{deleteTarget.name || deleteTarget.title}</strong>&rdquo;
              </p>
              <p className="delete-card-warning">
                Are you sure you want to permanently delete this {singular.toLowerCase()}? This action will remove it from the studio collection and cannot be undone.
              </p>
            </div>

            <div className="delete-card-actions">
              <button
                type="button"
                className="btn ghost"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn danger"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="spin" size={15} /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={15} /> Yes, Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
