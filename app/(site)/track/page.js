'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  CheckCircle2,
  Clock,
  Scissors,
  Package,
  Sparkles,
  Phone,
  MessageCircle,
  FileText,
  Ruler,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { api } from '@/lib/api';
import { digits } from '@/lib/utils';

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>Loading tracking portal...</div>}>
      <TrackContent />
    </Suspense>
  );
}

function TrackContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || searchParams.get('ticket') || searchParams.get('phone') || '';

  const [query, setQuery] = useState(initialQ);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState('');
  const [expandedSpecs, setExpandedSpecs] = useState({});

  const doTrack = useCallback(async (searchQuery) => {
    const q = (searchQuery || '').trim();
    if (!q) {
      setErr('Please enter your Ticket ID or Mobile Number.');
      return;
    }
    setLoading(true);
    setErr('');
    setSearched(true);
    try {
      const res = await api(`/api/submissions/track?q=${encodeURIComponent(q)}`);
      if (res.found && res.orders) {
        setOrders(res.orders);
      } else {
        setOrders([]);
        setErr(res.message || 'No orders found.');
      }
    } catch (e) {
      setOrders([]);
      setErr(e.message || 'Could not find any order matching this number or Ticket ID.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQ) {
      doTrack(initialQ);
    }
  }, [initialQ, doTrack]);

  const handleSubmit = (e) => {
    e.preventDefault();
    doTrack(query);
  };

  const toggleSpecs = (id) => {
    setExpandedSpecs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getStageIcon = (key) => {
    switch (key) {
      case 'new':
        return <Clock size={18} />;
      case 'verified':
        return <Ruler size={18} />;
      case 'cutting':
        return <Scissors size={18} />;
      case 'stitching':
        return <Sparkles size={18} />;
      case 'ready':
        return <Package size={18} />;
      case 'completed':
        return <CheckCircle2 size={18} />;
      default:
        return <Clock size={18} />;
    }
  };

  return (
    <div className="track-page-container">
      {/* Header Banner */}
      <div className="page-head">
        <div className="container">
          <span className="badge ok" style={{ marginBottom: 8, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Ruler size={13} /> BESPOKE TAILORING TRACKER
          </span>
          <h1>Track Your Tailoring Order</h1>
          <p className="lead" style={{ marginTop: 8 }}>
            Check real-time master cutter progress, stitching updates, and dispatch readiness using your Mobile Number or Ticket ID.
          </p>

          {/* Search Box */}
          <form className="track-search-form" onSubmit={handleSubmit}>
            <div className="track-input-wrap">
              <Search className="track-search-icon" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Mobile Number (e.g. 9840123456) or Ticket ID (e.g. SHARU-29F81E)..."
                className="track-search-input"
                autoFocus
              />
              {query && (
                <button type="button" className="track-clear-btn" onClick={() => setQuery('')}>
                  ✕
                </button>
              )}
            </div>
            <button type="submit" className="btn track-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="spin" size={16} /> Tracking...
                </>
              ) : (
                <>
                  <Search size={16} /> Track Status
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          {err && (
            <div className="alert track-alert" role="alert">
              <AlertCircle size={20} />
              <div>
                <strong>Order Not Found</strong>
                <p style={{ marginTop: 4 }}>{err}</p>
                <p style={{ fontSize: '0.85rem', marginTop: 6, color: '#666' }}>
                  Tip: Make sure you entered the same 10-digit mobile number you used while submitting your measurements, or enter your 6-character Ticket ID (found on your submission confirmation).
                </p>
              </div>
            </div>
          )}

          {/* Orders Results */}
          {orders.length > 0 && (
            <div className="track-results-list">
              <div className="track-results-header">
                <h2>
                  Found <strong>{orders.length}</strong> Tailoring {orders.length === 1 ? 'Order' : 'Orders'}
                </h2>
                <span className="live-status-pill">● Live Workshop Data</span>
              </div>

              {orders.map((ord) => {
                const isSpecsOpen = expandedSpecs[ord.id];
                const waText = encodeURIComponent(
                  `Hello Sharu Studio, I am inquiring about my order *${ord.guideTitle}* (Ticket: *${ord.ticketId}*). Could you please share the latest tailoring update?`
                );

                return (
                  <div key={ord.id} className="track-order-card">
                    {/* Order Top Ribbon */}
                    <div className="order-top-ribbon">
                      <div className="ribbon-left">
                        <span className="order-ticket-tag">#{ord.ticketId}</span>
                        <h3>{ord.guideTitle}</h3>
                        <span className="customer-tag">For: {ord.customerName}</span>
                      </div>
                      <div className="ribbon-right">
                        <span className={`status-pill status-${ord.status}`}>
                          {ord.stages[ord.stageIndex]?.label || ord.status.toUpperCase()}
                        </span>
                        <span className="order-date-label">
                          Received: {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Visual Progress Stepper */}
                    <div className="track-stepper-wrap">
                      <div className="track-stepper">
                        {ord.stages.map((stg, idx) => {
                          const isDone = idx < ord.stageIndex;
                          const isCurrent = idx === ord.stageIndex;
                          const isPending = idx > ord.stageIndex;

                          return (
                            <div
                              key={stg.key}
                              className={`stepper-node ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''} ${
                                isPending ? 'pending' : ''
                              }`}
                            >
                              <div className="node-icon-circle">
                                {isDone ? <CheckCircle2 size={16} /> : getStageIcon(stg.key)}
                              </div>
                              <span className="node-label">{stg.label}</span>
                              <span className="node-desc">{stg.desc}</span>
                              {idx < ord.stages.length - 1 && <div className="node-connector" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Master Tailor Notes / Workshop Update */}
                    <div className="tailor-update-box">
                      <div className="tailor-box-icon">
                        <Scissors size={20} />
                      </div>
                      <div className="tailor-box-content">
                        <h4>Master Tailor Atelier Note:</h4>
                        <p>{ord.tailorNote}</p>
                        {ord.eventDate && (
                          <div className="occasion-due-badge">
                            📅 Target Delivery Date: <strong>{ord.eventDate}</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Details Summary Grid */}
                    <div className="order-specs-preview-grid">
                      <div>
                        <span className="meta-label">Fit Preference</span>
                        <strong>{ord.fitPreference}</strong>
                      </div>
                      <div>
                        <span className="meta-label">Occasion / Function</span>
                        <strong>{ord.occasion || 'Custom Order'}</strong>
                      </div>
                      <div>
                        <span className="meta-label">Measurement Points</span>
                        <strong>{ord.measurements?.length || 0} Points Recorded</strong>
                      </div>
                      <div>
                        <span className="meta-label">Customer Contact</span>
                        <strong>{ord.phoneMasked}</strong>
                      </div>
                    </div>

                    {/* Collapsible Measurement Spec Sheet */}
                    {ord.measurements?.length > 0 && (
                      <div className="collapsible-specs-wrap">
                        <button
                          type="button"
                          className="specs-toggle-btn"
                          onClick={() => toggleSpecs(ord.id)}
                        >
                          <FileText size={16} />
                          {isSpecsOpen ? 'Hide Recorded Measurements' : 'View Recorded Measurements'}
                          {isSpecsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {isSpecsOpen && (
                          <div className="specs-table-box">
                            <table className="customer-measure-table">
                              <thead>
                                <tr>
                                  <th>Measurement Point</th>
                                  <th style={{ textAlign: 'right' }}>Size ({ord.unit})</th>
                                </tr>
                              </thead>
                              <tbody>
                                {ord.measurements.map((m, mIdx) => (
                                  <tr key={mIdx}>
                                    <td>{m.label}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                                      {m.value} {ord.unit}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Direct WhatsApp & Contact Actions */}
                    <div className="track-order-footer">
                      <a
                        href={`https://wa.me/919876543210?text=${waText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn sm wa-track-btn"
                      >
                        <MessageCircle size={16} /> Contact Tailor on WhatsApp
                      </a>
                      <a href="tel:+919876543210" className="btn ghost sm">
                        <Phone size={14} /> Call Studio (+91 98765 43210)
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* If nothing searched yet: Help cards */}
          {!searched && (
            <div className="track-help-grid">
              <div className="card track-info-card">
                <div className="card-icon-wrap">
                  <Ruler size={24} />
                </div>
                <h3>1. Sent Measurements Online?</h3>
                <p>
                  Whenever you submit sizes through our website wizard, a unique 6-character Ticket ID (like <strong>SHARU-29F81E</strong>) is instantly generated and confirmed on screen.
                </p>
              </div>

              <div className="card track-info-card">
                <div className="card-icon-wrap">
                  <Phone size={24} />
                </div>
                <h3>2. Track by Mobile Number</h3>
                <p>
                  Forgot your Ticket ID? Simply type your 10-digit mobile number in the search box above to instantly fetch all orders linked to your profile.
                </p>
              </div>

              <div className="card track-info-card">
                <div className="card-icon-wrap">
                  <Scissors size={24} />
                </div>
                <h3>3. Handcrafted to Precision</h3>
                <p>
                  Every garment undergoes 6 rigorous quality stages: inspection, cutting, hand-stitching, trial fitting, finishing press, and packaging.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
