'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Shirt,
  Users,
  Tag,
  Ruler,
  Scissors,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'All Products', icon: Shirt },
  { href: '/admin/combos', label: 'Family & Combos', icon: Users },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/guides', label: 'Measurement Guides', icon: Ruler },
  { href: '/admin/submissions', label: 'Master Tailor Tracker', icon: Scissors },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
];

export default function AdminShell({ children }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [path]);
  if (path === '/admin/login') return children;

  async function logout() {
    await fetch('/api/auth/login', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="adm">
      <div className="adm-top">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-light.png" alt="Sharu Studio" />
        <button type="button" onClick={() => setOpen(!open)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {open ? <><X size={18} /> Close</> : <><Menu size={18} /> Menu</>}
        </button>
      </div>

      {open && <div className="scrim" onClick={() => setOpen(false)} />}

      <aside className={`adm-side ${open ? 'open' : ''}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-light.png" alt="Sharu The Design Studio" style={{ maxWidth: '160px', marginBottom: 20 }} />

        <div className="adm-brand-badge">Bespoke Atelier Admin</div>

        <nav className="adm-nav-list">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={path === href ? 'on' : ''} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon size={17} style={{ flexShrink: 0 }} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="sp" />

        <a href="/" target="_blank" rel="noopener noreferrer" className="adm-view-site-link" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ExternalLink size={15} style={{ flexShrink: 0 }} />
          <span>View Public Website</span>
        </a>
        <button type="button" className="lnk adm-logout-btn" onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LogOut size={15} style={{ flexShrink: 0 }} />
          <span>Log Out</span>
        </button>
      </aside>

      <div className="adm-main">{children}</div>
    </div>
  );
}
