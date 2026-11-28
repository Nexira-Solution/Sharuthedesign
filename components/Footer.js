import Link from 'next/link';
import { digits } from '@/lib/utils';
import css from './Footer.module.css';

/* Inline brand icons (lucide-react removed brand logos in newer versions) */
const Instagram = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
  </svg>
);
const Facebook = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" />
  </svg>
);

// Usage in layout:  <Footer s={settings} />   (settings = getSettings() result)
export default function Footer({ s = {} }) {
  const links = s.footerLinks || [];
  const style = {
    ...(s.colorDark && { '--f-bg': s.colorDark }),
    ...(s.fontDisplay && { '--f-fd': `'${s.fontDisplay}', Georgia, serif` }),
    ...(s.fontBody && { '--f-fb': `'${s.fontBody}', system-ui, sans-serif` }),
  };

  return (
    <footer className={css.footer} style={style}>
      <div className={css.grid}>
        <div className={css.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-light.png" alt={s.storeName || 'Sharu The Design Studio'} />
          {s.footerAbout && <p>{s.footerAbout}</p>}
          {(s.instagram || s.facebook) && (
            <div className={css.social}>
              {s.instagram && <a href={s.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={18} /></a>}
              {s.facebook && <a href={s.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={18} /></a>}
            </div>
          )}
        </div>

        {links.length > 0 && (
          <nav aria-label="Footer">
            <h4>{s.footerExploreTitle || 'Explore'}</h4>
            {links.map((l, i) => (<Link key={i} href={l.href || '/'}>{l.label}</Link>))}
          </nav>
        )}

        <div>
          <h4>{s.footerContactTitle || 'Contact'}</h4>
          {s.address && <p>{s.address}</p>}
          {s.hours && <p>{s.hours}</p>}
          {s.phone && <a href={`tel:${s.phone}`}>{s.phone}</a>}
          {s.whatsapp && <a href={`https://wa.me/${digits(s.whatsapp)}`} target="_blank" rel="noopener noreferrer">WhatsApp chat</a>}
          {s.email && <a href={`mailto:${s.email}`}>{s.email}</a>}
        </div>
      </div>

      <div className={css.bottom}>
        <small>&copy; {new Date().getFullYear()} {s.storeName || 'Sharu The Design Studio'}. All rights reserved.</small>
        <small className={css.credit}>
          Designed and developed by{' '}
          <a href="https://www.nexirasolution.in" target="_blank" rel="noopener noreferrer">Nexira Solution</a>
        </small>
      </div>
    </footer>
  );
}