'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Menu, X } from 'lucide-react';
import css from './Navbar.module.css';

const FALLBACK = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/#about' },
  { label: 'Our Creations', href: '/collections' },
  // { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/#contact' },
];

// Usage in layout:  <Navbar name={s.storeName} s={s} />
export default function Navbar({ name = 'Sharu', s = {} }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();
  const isHome = path === '/';

  const links = s.navLinks?.length ? s.navLinks : FALLBACK;
  const bookHref = s.bookHref || '/measurements';
  const bookText = s.bookText || 'Give Your Measurement';

  useEffect(() => {
    const on = () => setScrolled((window.scrollY || 0) > 10);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setOpen(false), [path]);

  const solid = !isHome || scrolled || open;
  const style = s.colorDark ? { '--nav-solid': s.colorDark } : undefined;

  return (
    <header className={`${css.nav} ${isHome ? css.fixed : css.sticky} ${solid ? css.solid : ''}`} style={style}>
      <div className={css.in}>
        <Link href="/" className={css.logo} aria-label={name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-light.png" alt={name} />
        </Link>

        <nav className={css.links} aria-label="Main">
          {links.map((l, i) => (
            <Link key={i} href={l.href || '/'} className={path === l.href ? css.active : ''}>{l.label}</Link>
          ))}
        </nav>

        <Link href={bookHref} className={css.cta}><CalendarDays size={14} /> {bookText}</Link>

        <button className={css.burger} onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className={css.mobile} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className={css.mobileIn}>
              {links.map((l, i) => (<Link key={i} href={l.href || '/'}>{l.label}</Link>))}
              <Link href={bookHref} className={css.cta}><CalendarDays size={14} /> {bookText}</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}