'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
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
  Users,
  ExternalLink,
  ImagePlus,
} from 'lucide-react';
import Img from '@/components/Img';
import { api } from '@/lib/api';
import { isFamilyAudience } from '@/lib/utils';
import { uploadFile } from '@/components/admin/Fields';

export default function FamilyCombosAdmin() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  // Custom Delete Confirmation Card State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [uploadingPieceIdx, setUploadingPieceIdx] = useState(null);

  const handlePieceImageUpload = async (idx, file) => {
    if (!file) return;
    try {
      setUploadingPieceIdx(idx);
      const url = await uploadFile(file, 'combos');
      handlePieceChange(idx, 'image', url);
    } catch (err) {
      alert(`Failed to upload dress image: ${err.message}`);
    } finally {
      setUploadingPieceIdx(null);
    }
  };

  const load = useCallback(async () => {
    try {
      const [prods, cats] = await Promise.all([
        api('/api/products?limit=500'),
        api('/api/categories'),
      ]);
      const combos = prods.filter((p) => isFamilyAudience(p.audience) || p.groupMatching);
      setItems(combos);
      setCategories(cats);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openForm = (item) => {
    setErr('');
    if (item === 'new') {
      setForm({
        name: '',
        audience: 'family',
        groupMatching: true,
        category: categories.find((c) => isFamilyAudience(c.audience))?._id || '',
        price: '',
        fabric: 'Pure Mulberry Silk with Harmonized Zari',
        colors: ['Maragatham Emerald & Gold', 'Ivory & Crimson'],
        description: 'Complete family coordinated celebration set tailored from matching silk dye lots.',
        images: [],
        featured: true,
        active: true,
        comboPieces: [
          { label: 'Father / Groom', garmentType: 'Silk Kurta / Sherwani', audience: 'men', image: '' },
          { label: 'Mother / Bride', garmentType: 'Designer Blouse / Lehenga', audience: 'women', image: '' },
          { label: 'Son', garmentType: 'Boys Silk Kurta Dhoti', audience: 'kids', image: '' },
          { label: 'Daughter', garmentType: 'Girls Pattu Pavadai', audience: 'kids', image: '' },
        ],
      });
    } else {
      setForm({
        ...item,
        category: item.category?._id || item.category || '',
        colors: item.colors || [],
        comboPieces: item.comboPieces?.length ? item.comboPieces : [
          { label: 'Person 1', garmentType: 'Outfit 1', audience: 'men' },
          { label: 'Person 2', garmentType: 'Outfit 2', audience: 'women' },
        ],
      });
    }
    setEditing(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setEditing(null);
    setErr('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePieceChange = (index, key, val) => {
    const updated = [...(form.comboPieces || [])];
    updated[index] = { ...updated[index], [key]: val };
    setForm({ ...form, comboPieces: updated });
  };

  const addPiece = () => {
    setForm({
      ...form,
      comboPieces: [...(form.comboPieces || []), { label: 'New Member', garmentType: 'Kurta / Blouse', audience: 'men', image: '' }],
    });
  };

  const removePiece = (index) => {
    const updated = (form.comboPieces || []).filter((_, i) => i !== index);
    setForm({ ...form, comboPieces: updated });
  };

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setErr('');
    try {
      const body = {
        ...form,
        audience: 'family',
        groupMatching: true,
        category: form.category || null,
        colors: Array.isArray(form.colors)
          ? form.colors
          : (form.colors || '').split(',').map((x) => x.trim()).filter(Boolean),
      };

      if (editing === 'new') {
        await api('/api/products', 'POST', body);
      } else {
        await api(`/api/products/${editing._id}`, 'PUT', body);
      }
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
      await api(`/api/products/${deleteTarget._id}`, 'DELETE');
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

  const filtered = items.filter((it) => {
    if (search) {
      const q = search.toLowerCase();
      if (!it.name.toLowerCase().includes(q) && !(it.fabric || '').toLowerCase().includes(q)) return false;
    }
    if (filter === 'couple') return it.slug?.includes('couple') || it.name?.toLowerCase().includes('couple');
    if (filter === 'father-son') return it.slug?.includes('father') || it.name?.toLowerCase().includes('father');
    if (filter === 'mother-daughter') return it.slug?.includes('mother') || it.name?.toLowerCase().includes('mother');
    if (filter === 'full-family') return it.slug?.includes('family') || (it.comboPieces && it.comboPieces.length >= 3);
    return true;
  });

  const isFormOpen = editing !== null;

  /* ==========================================================
     FULL-PAGE FORM VIEW (FOR FAMILY COMBOS)
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
            <ArrowLeft size={18} /> Back to Family & Combos
          </button>

          <div className="full-page-title-block">
            <h1>{editing === 'new' ? 'Add New Family & Group Combo' : `Edit ${editing.name}`}</h1>
            <p className="lead">
              {editing === 'new'
                ? 'Create a coordinated celebration ensemble for couples, parents & kids with matching fabrics and motifs.'
                : `Editing details and member outfit breakdown for "${editing.name}".`}
            </p>
          </div>
        </div>

        {/* Full-Page Form Container Card */}
        <form className="full-page-form-card" onSubmit={save}>
          {err && <div className="alert" role="alert">{err}</div>}

          <div className="full-page-form-fields">
            <div className="field">
              <label>Combo Collection Name *</label>
              <input
                required
                value={form.name || ''}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Royal Dynasty Full Family Matching Wedding Set"
              />
            </div>

            <div className="form-grid">
              <div className="field">
                <label>Combo Price / Rate</label>
                <input
                  value={form.price || ''}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. ₹28,000 combo"
                />
              </div>
              <div className="field">
                <label>Category (Function)</label>
                <select
                  value={form.category || ''}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.audience})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label>Fabric Details & Weave</label>
              <input
                value={form.fabric || ''}
                onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                placeholder="e.g. Pure Mulberry Silk with Coordinated Zari Weaves"
              />
            </div>

            <div className="field">
              <label>Colorways (Comma Separated)</label>
              <input
                value={Array.isArray(form.colors) ? form.colors.join(', ') : form.colors || ''}
                onChange={(e) => setForm({ ...form, colors: e.target.value })}
                placeholder="e.g. Maragatham Emerald & Gold, Ivory & Crimson, Royal Navy"
              />
            </div>

            <div className="field">
              <label>Description</label>
              <textarea
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe how the outfits harmonize across family members..."
                rows={3}
              />
            </div>

            {/* Member Outfits Builder */}
            <div className="field" style={{ border: '1px solid var(--line)', padding: 18, background: '#fafaf8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <label style={{ margin: 0, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, fontSize: '1rem' }}>
                    <Users size={18} /> Coordinated Member Outfits in this Combo
                  </label>
                  <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                    Add each person who will wear a matching outfit in this set
                  </span>
                </div>
                <button type="button" className="btn ghost sm" onClick={addPiece}>
                  <Plus size={14} /> Add Member Outfit
                </button>
              </div>

              {(form.comboPieces || []).map((piece, idx) => (
                <div key={idx} className="combo-piece-builder-row">
                  <input
                    value={piece.label || ''}
                    onChange={(e) => handlePieceChange(idx, 'label', e.target.value)}
                    placeholder="Member (e.g. Father)"
                    className="piece-input-label"
                  />
                  <input
                    value={piece.garmentType || ''}
                    onChange={(e) => handlePieceChange(idx, 'garmentType', e.target.value)}
                    placeholder="Garment (e.g. Silk Kurta / Sherwani)"
                    className="piece-input-garment"
                  />
                  <select
                    value={piece.audience || 'men'}
                    onChange={(e) => handlePieceChange(idx, 'audience', e.target.value)}
                    className="piece-select-aud"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                  </select>

                  {/* Dress Image Upload Option */}
                  <div className="piece-img-box">
                    {piece.image ? (
                      <div className="piece-img-thumb-wrap">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={piece.image}
                          alt={piece.label || 'Dress'}
                          className="piece-thumb-preview"
                        />
                        <label className="piece-change-lbl" title="Change dress image">
                          Change
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handlePieceImageUpload(idx, e.target.files[0]);
                                e.target.value = '';
                              }
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          className="piece-img-remove-btn"
                          onClick={() => handlePieceChange(idx, 'image', '')}
                          title="Remove dress image"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <label className="piece-upload-trigger">
                        {uploadingPieceIdx === idx ? (
                          <>
                            <Loader2 size={13} className="spin" /> Uploading...
                          </>
                        ) : (
                          <>
                            <ImagePlus size={14} /> Upload Dress Photo
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          disabled={uploadingPieceIdx === idx}
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handlePieceImageUpload(idx, e.target.files[0]);
                              e.target.value = '';
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>

                  <button
                    type="button"
                    className="btn danger sm piece-del-btn"
                    onClick={() => removePiece(idx)}
                    title="Remove member"
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>

            <div className="form-grid" style={{ marginTop: 8 }}>
              <div className="check">
                <input
                  type="checkbox"
                  id="combo-feat"
                  checked={form.featured || false}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                <label htmlFor="combo-feat">⭐ Show on homepage as featured combo</label>
              </div>
              <div className="check">
                <input
                  type="checkbox"
                  id="combo-act"
                  checked={form.active !== false}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                />
                <label htmlFor="combo-act">Visible in live collection</label>
              </div>
            </div>
          </div>

          <div className="full-page-form-actions">
            <button type="button" className="btn ghost" onClick={closeForm}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="spin" size={16} /> Saving Combo...
                </>
              ) : (
                <>
                  <Check size={16} /> {editing === 'new' ? 'Create Family Combo' : 'Save Changes'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  /* ==========================================================
     FULL LISTING VIEW (FOR FAMILY COMBOS)
     ========================================================== */
  return (
    <div className="crud-listing-wrapper">
      {/* Top Header Bar */}
      <div className="adm-bar">
        <div>
          <h1>👨‍👩‍👧‍👦 Family & Group Coordinated Sets</h1>
          <p className="lead">
            Manage matching ensembles for Families, Couples, Father & Son, Mother & Daughter, and Wedding Entourages.
          </p>
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => openForm('new')}
        >
          <Plus size={16} /> Add New Family Combo
        </button>
      </div>

      {err && <div className="alert" role="alert">{err}</div>}

      {/* Filter Chips & Search Bar */}
      <div className="adm-filter-bar">
        <div className="filters" style={{ margin: '0 0 10px' }}>
          {[
            ['all', 'All Combos'],
            ['couple', '👫 Couple Sets'],
            ['father-son', '👨‍👦 Father & Son'],
            ['mother-daughter', '👩‍👧 Mother & Daughter'],
            ['full-family', '👨‍👩‍👧‍👦 Full Family'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`chip sm ${filter === id ? 'on' : ''}`}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="adm-search-row">
          <div className="search-input-wrapper">
            <Search size={15} className="search-icon-inline" />
            <input
              type="text"
              placeholder="Search family combo name or fabric..."
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
            <strong>{filtered.length}</strong> sets
          </span>
        </div>
      </div>

      {loading ? (
        <div className="loading-box">
          <Loader2 className="spin" size={24} />
          <p>Loading family sets...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <p style={{ fontSize: '1.2rem', marginBottom: 12 }}>No family combo sets found.</p>
          <button type="button" className="btn sm" onClick={() => openForm('new')}>
            <Plus size={15} /> Create First Family Set
          </button>
        </div>
      ) : (
        <div className="combos-grid">
          {filtered.map((item) => (
            <div key={item._id} className="combo-admin-card">
              <div className="combo-card-top">
                <div className="combo-card-thumb">
                  <Img
                    src={
                      item.images?.[0] ||
                      'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={item.name}
                    w={300}
                  />
                  <span className="combo-badge-overlay">
                    👨‍👩‍👧‍👦 {item.comboPieces?.length || 2} Members
                  </span>
                </div>
                <div className="combo-card-main">
                  <div className="combo-status-pills">
                    <span className={`combo-status-pill ${item.active ? 'live' : 'draft'}`}>
                      <span className="dot" /> {item.active ? 'Visible' : 'Hidden'}
                    </span>
                    {item.featured && (
                      <span className="combo-status-pill featured">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  <h3>{item.name}</h3>
                </div>
              </div>

              <div className="combo-card-footer">
                <div className="acts single-row-acts">
                  <Link href={`/collections/${item.slug}`} target="_blank" className="btn ghost sm">
                    <ExternalLink size={13} style={{ display: 'inline', marginRight: 4 }} /> Preview
                  </Link>
                  <button
                    type="button"
                    className="btn ghost sm"
                    onClick={() => openForm(item)}
                    title="Edit combo"
                  >
                    <Edit2 size={13} style={{ display: 'inline', marginRight: 4 }} /> Edit
                  </button>
                  <button
                    type="button"
                    className="btn danger sm"
                    onClick={() => setDeleteTarget(item)}
                    title="Delete combo"
                  >
                    <Trash2 size={13} style={{ display: 'inline', marginRight: 4 }} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
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
              <h3>Delete Family Combo Set?</h3>
              <p className="delete-card-name">
                &ldquo;<strong>{deleteTarget.name}</strong>&rdquo;
              </p>
              <p className="delete-card-warning">
                Are you sure you want to delete this coordinated family set? All member outfit configurations will be removed from the catalog. This action cannot be undone.
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
                    <Trash2 size={15} /> Yes, Delete Combo
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
