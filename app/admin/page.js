'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Shirt,
  Users,
  Clock,
  ClipboardList,
  Scissors,
  RefreshCw,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { api } from '@/lib/api';

const STATUS_LABELS = {
  new: 'NEW',
  verified: 'VERIFIED',
  cutting: 'CUTTING',
  stitching: 'STITCHING',
  ready: 'READY',
  completed: 'DELIVERED',
};

export default function Dashboard() {
  const [s, setS] = useState(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [seeding, setSeeding] = useState(false);

  const load = () =>
    api('/api/admin/stats')
      .then(setS)
      .catch((e) => setErr(e.message));

  useEffect(() => {
    load();
  }, []);

  async function triggerSeed(reset = false) {
    if (reset && !confirm('This will reload all sample data (Men, Women, Kids, Family Combos, Guides & Orders). Continue?')) return;
    setSeeding(true);
    setErr('');
    setMsg('');
    try {
      const res = await api('/api/admin/seed', 'POST', { reset });
      setMsg(
        `✓ Sample data refreshed! Added ${res.products} products, ${res.categories} categories, ${res.guides} guides, and ${res.submissions} orders.`
      );
      load();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSeeding(false);
    }
  }

  const statCards = s
    ? [
        {
          label: "Today's Orders",
          count: s.todayOrders ?? 0,
          href: '/admin/submissions',
          icon: Clock,
          alert: (s.todayOrders || 0) > 0,
        },
        {
          label: 'Total Orders',
          count: s.submissions ?? 0,
          href: '/admin/submissions',
          icon: ClipboardList,
        },
        {
          label: 'In Tailoring Pipeline',
          count: s.activeTailoring ?? 0,
          href: '/admin/submissions',
          icon: Scissors,
          badge: 'Active',
        },
        {
          label: 'Total Products',
          count: s.products ?? 0,
          href: '/admin/products',
          icon: Shirt,
        },
        {
          label: 'Family & Group Combos',
          count: s.combosCount ?? 0,
          href: '/admin/combos',
          icon: Users,
          badge: 'Active',
        },
      ]
    : [];

  return (
    <>
      <div className="adm-bar">
        <div>
          <h1>Bespoke Studio Dashboard</h1>
          <p className="lead">
            Welcome to Sharu The Design Studio atelier manager. Monitor customer sizing submissions, products, and family coordinated collections.
          </p>
        </div>

        <div className="adm-header-actions">
          <button
            type="button"
            className="btn ghost sm"
            onClick={() => triggerSeed(true)}
            disabled={seeding}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <RefreshCw size={14} className={seeding ? 'spin' : ''} />
            {seeding ? 'Seeding Data...' : 'Reload All Sample Data'}
          </button>
          <Link href="/admin/submissions" className="btn sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Scissors size={14} /> View Master Tailor Pipeline
          </Link>
        </div>
      </div>

      {err && <div className="alert" role="alert">{err}</div>}
      {msg && <div className="alert ok">{msg}</div>}

      {/* Primary Studio Analytics Cards */}
      <div className="stat-grid luxury-stats">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.label} href={c.href} className={`stat ${c.alert ? 'stat-alert' : ''}`}>
              <div className="stat-top">
                <span className="stat-icon" style={{ display: 'flex', alignItems: 'center', color: 'var(--muted)' }}>
                  <Icon size={20} />
                </span>
                {c.badge && <span className="stat-badge">{c.badge}</span>}
              </div>
              <b>{c.count}</b>
              <span>{c.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Recent Incoming Customer Measurements */}
      <div className="card">
        <div className="card-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3>Latest Customer Sizing Submissions</h3>
          <Link href="/admin/submissions" className="btn ghost sm">
            View All ({s?.submissions || 0})
          </Link>
        </div>

        {s?.recent?.length ? (
          <div className="recent-orders-list">
            {s.recent.map((r) => {
              const ticket = `SHARU-${r._id.slice(-6).toUpperCase()}`;
              return (
                <div key={r._id} className="recent-order-row">
                  <div className="summary-left">
                    <span className={`badge ${r.status || 'new'}`}>
                      {STATUS_LABELS[r.status] || 'NEW'}
                    </span>
                    <strong className="order-customer-name">{r.customerName}</strong>
                    <span className="order-ticket-id">#{ticket}</span>
                  </div>

                  <div className="summary-right">
                    <span className="order-location" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={12} />
                      {r.city ? `${r.city}, ` : ''}
                      {r.country || 'India'}
                    </span>
                    <small className="order-timestamp">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </small>
                    <Link
                      href="/admin/submissions"
                      className="btn ghost sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}
                    >
                      Open Specs <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="lead">No customer measurements recorded yet. Load sample data to test!</p>
        )}
      </div>
    </>
  );
}
