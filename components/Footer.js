import Link from 'next/link';
import { digits } from '@/lib/utils';
import { Search } from 'lucide-react';

export default function Footer({ s = {} }) {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-light.png" alt={s.storeName || 'Sharu Studio'} />
          <p>{s.tagline || 'Boutique for Men, Women & Kids'}</p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link href="/collections">Collections</Link>
          <Link href="/collections?audience=men">Men</Link>
          <Link href="/collections?audience=women">Women</Link>
          <Link href="/collections?audience=kids">Kids</Link>
          <Link href="/collections?audience=family">Family & Group Combos</Link>
          <Link href="/measurements">Send Measurements</Link>
          {/* <Link href="/track" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Search size={13} /> Track Order Status
          </Link> */}
        </div>
        <div>
          <h4>Visit Atelier</h4>
          {s.address && <p>{s.address}</p>}
          {s.hours && <p>{s.hours}</p>}
          {s.phone && <a href={`tel:${s.phone}`}>{s.phone}</a>}
          {s.whatsapp && <a href={`https://wa.me/${digits(s.whatsapp)}`}>WhatsApp Chat</a>}
          {s.email && <a href={`mailto:${s.email}`}>{s.email}</a>}
          {s.instagram && <a href={s.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
          {s.facebook && <a href={s.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>}
        </div>
      </div>
      <div className="container footer-bottom">
        <small>&copy; {new Date().getFullYear()} {s.storeName || 'Sharu The Design Studio'}. All rights reserved.</small>
        <span className="footer-credit">Design and developed by <b>Nexira solutions </b></span>
      </div>
    </footer>
  );
}
