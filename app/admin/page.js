'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Shirt,
  Users,
  User,
  Sparkles,
  Smile,
  Clock,
  Scissors,
  ClipboardList,
  Tag,
  Ruler,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { api } from '@/lib/api';

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
        { label: 'All Products', count: s.products, href: '/admin/products', icon: Shirt },
        { label: 'Family & Group Combos', count: s.combosCount, href: '/admin/combos', icon: Users, badge: 'Active' },
        { label: 'Men Pieces', count: s.menCount, href: '/admin/products', icon: User },
        { label: 'Women Pieces', count: s.womenCount, href: '/admin/products', icon: Sparkles },
        { label: 'Kids Pieces', count: s.kidsCount, href: '/admin/products', icon: Smile },
        { label: 'New Measurements', count: s.newSubmissions, href: '/admin/submissions?status=new', icon: Clock, alert: s.newSubmissions > 0 },
        { label: 'In Tailoring Pipeline', count: s.activeTailoring, href: '/admin/submissions', icon: Scissors },
        { label: 'Total Orders Recorded', count: s.submissions, href: '/admin/submissions', icon: ClipboardList },
        { label: 'Categories', count: s.categories, href: '/admin/categories', icon: Tag },
        { label: 'Measurement Guides', count: s.guides, href: '/admin/guides', icon: Ruler },
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

      {/* Quick Action Hub */}
      <div className="admin-shortcuts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, margin: '24px 0' }}>
        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={18} /> Family & Group Matching Sets
          </h3>
          <p className="lead" style={{ margin: '8px 0 16px', fontSize: '0.95rem' }}>
            Manage couple sets, father & son kurtas, mother & daughter matching dresses, and royal full family sets.
          </p>
          <Link href="/admin/combos" className="btn sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Manage Family Combos <ArrowRight size={14} />
          </Link>
        </div>

        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Scissors size={18} /> Master Tailoring Queue
          </h3>
          <p className="lead" style={{ margin: '8px 0 16px', fontSize: '0.95rem' }}>
            Verify customer sizes, send patterns to the cutting table, and notify clients directly via WhatsApp.
          </p>
          <Link href="/admin/submissions" className="btn sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Open Tailor Pipeline <ArrowRight size={14} />
          </Link>
        </div>

        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Ruler size={18} /> Measurement Guides
          </h3>
          <p className="lead" style={{ margin: '8px 0 16px', fontSize: '0.95rem' }}>
            Configure step-by-step picture guides and tailor tips for Shirts, Blouses, Kurtas, Suits, and Kids.
          </p>
          <Link href="/admin/guides" className="btn sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Manage Guides <ArrowRight size={14} />
          </Link>
        </div>
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
                <div
                  key={r._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: '1px solid var(--line)',
                    flexWrap: 'wrap',
                    gap: 10,
                  }}
                >
                  <div>
                    <span className={`badge ${r.status}`}>{r.status}</span>
                    <strong>{r.customerName}</strong>
                    <span style={{ color: 'var(--muted)', marginLeft: 8 }}>
                      • {r.guideTitle} ({r.country || 'India'})
                    </span>
                    <span className="order-ticket-id" style={{ marginLeft: 8 }}>#{ticket}</span>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <small style={{ color: 'var(--muted)' }}>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </small>
                    <Link href="/admin/submissions" className="btn ghost sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
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
