'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Ruler, Menu, X } from 'lucide-react';

const links = [
  ['/', 'Home'],
  ['/collections', 'Collections'],
  ['/track', 'Track Order'],
  ['/#visit', 'Visit Studio'],
];

export default function Navbar({ name = 'Sharu' }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const top = window.scrollY || document.documentElement.scrollTop || 0;
      setScrolled(top > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setOpen(false), [path]);

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-in">
        <Link href="/" className="nav-logo" aria-label={name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-dark.png" alt={name} />
        </Link>

        <nav className="nav-links" aria-label="Main">
          {links.map(([h, l]) => (
            <Link key={h} href={h} className={path === h ? 'active' : ''}>
              {l}
            </Link>
          ))}
          <Link href="/measurements" className="btn sm nav-cta-btn">
            <Ruler size={14} /> Send Measurements
          </Link>
        </nav>

        <button
          className="nav-burger-btn"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close Menu' : 'Open Menu'}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="nav-mobile-inner">
              {links.map(([h, l]) => (
                <Link key={h + l} href={h} className={path === h ? 'active' : ''}>
                  {l}
                </Link>
              ))}
              <Link href="/measurements" className="btn nav-mobile-cta">
                <Ruler size={16} /> Send My Measurements
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
