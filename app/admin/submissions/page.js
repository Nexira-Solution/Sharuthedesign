'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  Scissors,
  RefreshCw,
  Printer,
  MessageCircle,
  MapPin,
  Calendar,
  Phone,
  Trash2,
  Save,
  CheckCircle2,
  Clock,
  Package,
  Ruler,
  Check,
  Users,
} from 'lucide-react';
import { api } from '@/lib/api';
import { digits } from '@/lib/utils';

const PIPELINE_STATUSES = [
  { id: '', label: 'All Orders', color: '' },
  { id: 'new', label: 'New Orders', badgeClass: 'new' },
  { id: 'verified', label: 'Verified Specs', badgeClass: 'verified' },
  { id: 'cutting', label: 'Pattern Cutting', badgeClass: 'cutting' },
  { id: 'stitching', label: 'In Stitching', badgeClass: 'stitching' },
  { id: 'ready', label: 'Ready / QC', badgeClass: 'ready' },
  { id: 'completed', label: 'Delivered', badgeClass: 'completed' },
];

export default function SubmissionsMasterPage() {
  const [items, setItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [savingNoteId, setSavingNoteId] = useState(null);
  const [tailorNotesDraft, setTailorNotesDraft] = useState({});
  const [printingDoc, setPrintingDoc] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api(`/api/submissions${statusFilter ? `?status=${statusFilter}` : ''}`);
      setItems(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id, newStatus) => {
    try {
      await api(`/api/submissions/${id}`, 'PUT', { status: newStatus });
      await load();
    } catch (e) {
      setErr(e.message);
    }
  };

  const saveTailorNotes = async (id) => {
    try {
      setSavingNoteId(id);
      await api(`/api/submissions/${id}`, 'PUT', { tailorNotes: tailorNotesDraft[id] || '' });
      await load();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSavingNoteId(null);
    }
  };

  const deleteSubmission = async (id, name) => {
    if (!confirm(`Delete measurement record for "${name}"? This cannot be undone.`)) return;
    try {
      await api(`/api/submissions/${id}`, 'DELETE');
      await load();
    } catch (e) {
      setErr(e.message);
    }
  };

  const getWhatsAppMessage = (s, templateType = 'update') => {
    const ticketId = s._id ? `SHARU-${s._id.slice(-6).toUpperCase()}` : '';
    let msg = '';
    if (templateType === 'verified') {
      msg = `Hello ${s.customerName},\nGreetings from *Sharu The Design Studio*!\nWe have verified your measurements for *${s.guideTitle}* (Ticket ID: *${ticketId}*).\nOur master cutter will now prepare your custom pattern.\nThank you!`;
    } else if (templateType === 'stitching') {
      msg = `Hello ${s.customerName},\nYour bespoke *${s.guideTitle}* (Ticket ID: *${ticketId}*) is currently on the master tailor stitching table.\nWe will notify you once it passes quality check!`;
    } else if (templateType === 'ready') {
      msg = `Hello ${s.customerName},\nGreat news! Your tailored *${s.guideTitle}* (Ticket ID: *${ticketId}*) is finished, inspected, and ready for pickup / courier dispatch!\nKindly confirm your delivery timing.`;
    } else {
      msg = `Hello ${s.customerName},\nGreetings from *Sharu The Design Studio* regarding your custom order for *${s.guideTitle}* (Ticket ID: *${ticketId}*).`;
    }
    return `https://wa.me/${digits(s.phone)}?text=${encodeURIComponent(msg)}`;
  };

  const filteredItems = items.filter((s) => {
    if (audienceFilter !== 'all') {
      if (audienceFilter === 'family') {
        if (s.audience !== 'family' && s.audience !== 'family-group') return false;
      } else if (s.audience !== audienceFilter) {
        return false;
      }
    }
    if (search) {
      const q = search.toLowerCase();
      const match =
        (s.customerName || '').toLowerCase().includes(q) ||
        (s.phone || '').toLowerCase().includes(q) ||
        (s.guideTitle || '').toLowerCase().includes(q) ||
        (s.country || '').toLowerCase().includes(q) ||
        (s.city || '').toLowerCase().includes(q) ||
        (s._id || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <>
      <div className="adm-bar">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Scissors size={26} /> Master Tailor Tracking & Orders
          </h1>
          <p className="lead">
            Track customer measurements, manage cutting & stitching workflow, print tailoring cards, and send instant WhatsApp updates.
          </p>
        </div>
        <button type="button" className="btn ghost" onClick={load} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Tailoring Pipeline Filter Tabs */}
      <div className="pipeline-tabs-bar">
        <div className="filters" style={{ margin: '0 0 12px' }}>
          {PIPELINE_STATUSES.map((st) => {
            const count = st.id ? items.filter((x) => x.status === st.id).length : items.length;
            return (
              <button
                key={st.id}
                type="button"
                className={`chip sm ${statusFilter === st.id ? 'on' : ''}`}
                onClick={() => setStatusFilter(st.id)}
              >
                {st.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Audience and Search Bar */}
        <div className="adm-search-row">
          <select
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value)}
            className="adm-audience-select"
          >
            <option value="all">All Groups</option>
            <option value="men">👔 Men</option>
            <option value="women">👗 Women</option>
            <option value="kids">🧒 Kids</option>
            <option value="family">👨‍👩‍👧‍👦 Family & Groups</option>
          </select>

          <input
            type="text"
            placeholder="Search by customer name, phone, ticket ID, country, or dress..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="adm-search-input"
          />
          {search && (
            <button type="button" className="adm-clear-search" onClick={() => setSearch('')}>
              Clear
            </button>
          )}

          <span className="adm-count-badge">
            Showing <strong>{filteredItems.length}</strong> records
          </span>
        </div>
      </div>

      {err && <div className="alert" role="alert">{err}</div>}

      {loading ? (
        <p>Loading master tailor orders...</p>
      ) : filteredItems.length === 0 ? (
        <div className="empty">
          <p style={{ fontSize: '1.2rem', marginBottom: 8 }}>No measurement records found.</p>
          <p className="lead">Customers who send sizes from the website will automatically appear in this pipeline.</p>
        </div>
      ) : (
        <div className="submissions-pipeline-list">
          {filteredItems.map((s) => {
            const ticketId = `SHARU-${s._id.slice(-6).toUpperCase()}`;
            const isFam = s.audience === 'family' || s.audience === 'family-group';

            return (
              <details className="sub tailor-order-card" key={s._id} open={s.status === 'new'}>
                <summary className="order-summary-bar">
                  <div className="summary-left">
                    <span className={`badge ${s.status || 'new'}`}>
                      {s.status === 'verified'
                        ? 'VERIFIED'
                        : s.status === 'cutting'
                        ? 'CUTTING'
                        : s.status === 'stitching'
                        ? 'STITCHING'
                        : s.status === 'ready'
                        ? 'READY'
                        : s.status === 'completed'
                        ? 'DELIVERED'
                        : 'NEW'}
                    </span>
                    <strong className="order-customer-name">{s.customerName}</strong>
                    <span className="order-garment-title">
                      {isFam && <Users size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />}
                      {s.guideTitle}
                    </span>
                    <span className="order-ticket-id">#{ticketId}</span>
                  </div>

                  <div className="summary-right">
                    <span className="order-location" style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <MapPin size={12} />
                      {s.city ? `${s.city}, ` : ''}
                      {s.country || 'India'}
                    </span>
                    <small className="order-timestamp">{new Date(s.createdAt).toLocaleDateString()}</small>
                  </div>
                </summary>

                <div className="in order-details-body">
                  {/* Customer Quick Contact & Meta Header */}
                  <div className="order-meta-grid">
                    <div>
                      <span className="meta-label">Customer Phone / WhatsApp:</span>
                      <p>
                        <a href={`tel:${s.phone}`}>
                          <strong>{s.phone}</strong>
                        </a>{' '}
                        &nbsp;
                        <a
                          className="badge ok"
                          href={`https://wa.me/${digits(s.phone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                        >
                          <MessageCircle size={12} /> Open Chat
                        </a>
                      </p>
                      {s.email && <p className="meta-sub">Email: {s.email}</p>}
                    </div>

                    <div>
                      <span className="meta-label">Occasion / Function:</span>
                      <p>
                        <strong>{s.occasion || 'Custom Tailoring'}</strong>
                        {s.eventDate && <span> (Due Date: <strong>{s.eventDate}</strong>)</span>}
                      </p>
                    </div>

                    <div>
                      <span className="meta-label">Fit Preference:</span>
                      <p>
                        <span className="badge">{s.fitPreference || 'Regular Fit'}</span>
                        <span className="badge">Unit: {s.unit || 'inches'}</span>
                      </p>
                    </div>

                    {s.reference && (
                      <div>
                        <span className="meta-label">Liked Design Reference:</span>
                        <p>{s.reference}</p>
                      </div>
                    )}
                  </div>

                  {/* Complete Master Tailor Specification Table */}
                  <div className="spec-table-container">
                    <div className="spec-table-header">
                      <h4>Master Tailor Cut Sheet ({s.unit || 'inches'})</h4>
                      <button
                        type="button"
                        className="btn ghost sm print-btn"
                        onClick={() => {
                          setPrintingDoc(s);
                          setTimeout(() => window.print(), 100);
                        }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                      >
                        <Printer size={14} /> Print Tailor Work Order
                      </button>
                    </div>

                    <table className="tailor-spec-table">
                      <thead>
                        <tr>
                          <th>Measurement Point</th>
                          <th style={{ textAlign: 'right' }}>Size ({s.unit})</th>
                          <th style={{ textAlign: 'center', width: '90px' }}>Pattern Cut ✓</th>
                          <th style={{ textAlign: 'center', width: '90px' }}>Stitched ✓</th>
                        </tr>
                      </thead>
                      <tbody>
                        {s.measurements?.map((m, i) => (
                          <tr key={i}>
                            <td>
                              <strong>{m.label}</strong>
                            </td>
                            <td style={{ textAlign: 'right', fontSize: '1.05rem', fontWeight: 600 }}>
                              {m.value} {s.unit}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <input type="checkbox" className="tailor-check" />
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <input type="checkbox" className="tailor-check" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Customer Notes */}
                  {s.notes && (
                    <div className="note" style={{ margin: '14px 0' }}>
                      <strong>Customer Notes / Styling Requests:</strong>
                      <p style={{ marginTop: 4 }}>{s.notes}</p>
                    </div>
                  )}

                  {/* Master Tailor Internal Notes Box */}
                  <div className="tailor-notes-section">
                    <label htmlFor={`tn-${s._id}`}>
                      <strong>Master Cutter & Tailor Internal Notes:</strong>
                    </label>
                    <div className="tailor-note-input-row">
                      <textarea
                        id={`tn-${s._id}`}
                        rows={2}
                        defaultValue={s.tailorNotes || ''}
                        onChange={(e) => setTailorNotesDraft({ ...tailorNotesDraft, [s._id]: e.target.value })}
                        placeholder="Add fabric cut date, ease adjustments (+0.5 in), thread shade, or tailor name..."
                      />
                      <button
                        type="button"
                        className="btn sm"
                        onClick={() => saveTailorNotes(s._id)}
                        disabled={savingNoteId === s._id}
                      >
                        {savingNoteId === s._id ? 'Saving...' : 'Save Note'}
                      </button>
                    </div>
                  </div>

                  {/* Action Bar: Pipeline Advancement & WhatsApp Updates */}
                  <div className="order-actions-bar">
                    <div className="pipeline-advance-group">
                      <span className="actions-label">Advance Status:</span>
                      {s.status !== 'verified' && (
                        <button
                          type="button"
                          className="btn ghost sm"
                          onClick={() => updateStatus(s._id, 'verified')}
                        >
                          Mark Specs Verified
                        </button>
                      )}
                      {s.status !== 'cutting' && (
                        <button
                          type="button"
                          className="btn ghost sm"
                          onClick={() => updateStatus(s._id, 'cutting')}
                        >
                          Send to Cutting Table
                        </button>
                      )}
                      {s.status !== 'stitching' && (
                        <button
                          type="button"
                          className="btn ghost sm"
                          onClick={() => updateStatus(s._id, 'stitching')}
                        >
                          In Stitching
                        </button>
                      )}
                      {s.status !== 'ready' && (
                        <button
                          type="button"
                          className="btn ghost sm"
                          onClick={() => updateStatus(s._id, 'ready')}
                        >
                          Ready for QC / Dispatch
                        </button>
                      )}
                      {s.status !== 'completed' && (
                        <button
                          type="button"
                          className="btn ghost sm"
                          onClick={() => updateStatus(s._id, 'completed')}
                        >
                          Mark Completed / Delivered
                        </button>
                      )}
                    </div>

                    <div className="client-msg-group">
                      <span className="actions-label">Notify Customer:</span>
                      <a
                        className="btn ghost sm"
                        href={getWhatsAppMessage(s, 'verified')}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        <MessageCircle size={12} /> Specs Verified
                      </a>
                      <a
                        className="btn ghost sm"
                        href={getWhatsAppMessage(s, 'stitching')}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        <MessageCircle size={12} /> In Stitching
                      </a>
                      <a
                        className="btn ghost sm"
                        href={getWhatsAppMessage(s, 'ready')}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        <MessageCircle size={12} /> Ready for Dispatch
                      </a>
                      <button
                        type="button"
                        className="btn danger sm"
                        onClick={() => deleteSubmission(s._id, s.customerName)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      )}

      {/* Hidden Printable Master Tailor Work Sheet (Activated by window.print()) */}
      {printingDoc && (
        <div className="printable-work-order">
          <div className="print-header">
            <h2>SHARU THE DESIGN STUDIO</h2>
            <p>Bespoke Tailoring Atelier • Master Cut Work Order</p>
            <div className="print-ticket">TICKET ID: #{printingDoc._id ? `SHARU-${printingDoc._id.slice(-6).toUpperCase()}` : ''}</div>
          </div>

          <div className="print-meta-grid">
            <div><strong>Customer:</strong> {printingDoc.customerName}</div>
            <div><strong>Phone / WA:</strong> {printingDoc.phone}</div>
            <div><strong>Country:</strong> {printingDoc.country || 'India'}</div>
            <div><strong>Dress / Garment:</strong> {printingDoc.guideTitle}</div>
            <div><strong>Occasion / Event:</strong> {printingDoc.occasion || 'Bespoke Order'}</div>
            <div><strong>Need-By Date:</strong> {printingDoc.eventDate || 'Urgent'}</div>
            <div><strong>Fit Preference:</strong> {printingDoc.fitPreference || 'Regular Fit'}</div>
            <div><strong>Measurement Unit:</strong> {printingDoc.unit || 'inches'}</div>
          </div>

          <table className="print-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Measurement Point</th>
                <th>Size ({printingDoc.unit})</th>
                <th>Cutter Checked</th>
                <th>Tailor Finished</th>
              </tr>
            </thead>
            <tbody>
              {printingDoc.measurements?.map((m, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td><strong>{m.label}</strong></td>
                  <td style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{m.value} {printingDoc.unit}</td>
                  <td style={{ textAlign: 'center' }}>[ &nbsp; ]</td>
                  <td style={{ textAlign: 'center' }}>[ &nbsp; ]</td>
                </tr>
              ))}
            </tbody>
          </table>

          {printingDoc.notes && (
            <div className="print-notes">
              <strong>Customer Instructions:</strong> {printingDoc.notes}
            </div>
          )}

          {printingDoc.tailorNotes && (
            <div className="print-notes">
              <strong>Master Cutter Notes:</strong> {printingDoc.tailorNotes}
            </div>
          )}

          <div className="print-signatures">
            <div>Master Cutter Sign: _____________________</div>
            <div>Quality Inspector Sign: _____________________</div>
            <div>Delivery Date: _____________________</div>
          </div>
        </div>
      )}
    </>
  );
}
