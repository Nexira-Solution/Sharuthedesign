import { Fragment } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import Img from '@/components/Img';
import ThemeStyle from '@/components/ThemeStyle';
import { getSettings, getProducts } from '@/lib/data';
import { digits } from '@/lib/utils';
import css from './home.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const s = await getSettings();
  return {
    title: `${s.storeName || 'Sharu The Design Studio'} | ${s.tagline || 'Bespoke Wedding Couture for Brides & Grooms'}`,
    description: s.heroSubtitle,
    alternates: { canonical: '/' },
  };
}

/* Render text with line breaks (admin can press Enter in the textarea) */
function Lines({ text = '' }) {
  const parts = String(text).split(/\r?\n/).filter(Boolean);
  return parts.map((t, i) => (
    <Fragment key={i}>{i > 0 && <br />}{t}</Fragment>
  ));
}

/* Shows the WHOLE photo (never cropped); a blurred copy fills any spare space */
function Fit({ src, w = 900, eager = false }) {
  return (
    <>
      <span className={css.fitBack} aria-hidden="true"><Img src={src} alt="" w={Math.min(w, 400)} /></span>
      <span className={css.fitFront}><Img src={src} alt="" w={w} {...(eager ? { loading: 'eager' } : {})} /></span>
    </>
  );
}

/* Floral line art for the About section */
function Floral() {
  return (
    <svg className={css.floral} viewBox="0 0 160 260" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M80 250 C78 200 84 150 96 100" />
      <path d="M96 100 C70 80 60 50 72 20 C98 34 108 70 96 100Z" />
      <path d="M96 100 C118 84 140 80 150 64 C126 50 104 66 96 100Z" />
      <path d="M82 190 C56 186 36 170 30 148 C56 148 76 164 82 190Z" />
      <path d="M86 160 C110 160 130 148 138 126 C112 122 92 138 86 160Z" />
      <circle cx="96" cy="100" r="4" />
      <path d="M40 235 C60 215 66 200 64 180" />
      <path d="M64 180 C44 176 34 160 38 142 C56 150 66 164 64 180Z" />
    </svg>
  );
}

export default async function Home() {
  const s = await getSettings();

  // Gallery: admin-chosen images first, product photos only as a fallback
  let gallery = (s.gallery || []).filter(Boolean);
  if (!gallery.length) {
    try {
      const all = await getProducts({ limit: 12 });
      gallery = all.map((p) => p.images?.[0]).filter(Boolean);
    } catch { /* ignore */ }
  }
  gallery = gallery.slice(0, 6);

  const tiles = (s.coupleTiles || []).slice(0, 4);
  const aboutImg = s.aboutImage || s.coupleBg;
  const overlay = Math.min(0.9, Math.max(0, parseFloat(s.heroOverlay) || 0.45));

  // Theme values from Admin > Site settings (fall back to CSS defaults when blank)
  const vars = {
    '--overlay': overlay,
    ...(s.colorBg && { '--cream': s.colorBg }),
    ...(s.colorText && { '--ink': s.colorText }),
    ...(s.colorDark && { '--dark': s.colorDark }),
    ...(s.colorPrimary && { '--primary': s.colorPrimary }),
    ...(s.fontDisplay && { '--fd': `'${s.fontDisplay}', Georgia, serif` }),
    ...(s.fontBody && { '--fb': `'${s.fontBody}', system-ui, sans-serif` }),
    ...(s.fontScript && { '--fs': `'${s.fontScript}', cursive` }),
  };

  const bookHref = s.bookHref || '/measurements';

  // Map: accepts the embed URL or the whole <iframe> code pasted from Google Maps
  const mapSrc = (String(s.mapEmbed || '').match(/src="([^"]+)"/)?.[1] || String(s.mapEmbed || '').trim());
  const mapOk = /^https:\/\/(www\.)?(maps\.)?google\.[a-z.]+\/maps/i.test(mapSrc);

  return (
    <main className={`theme ${css.page}`} style={vars}>
      <ThemeStyle s={s} />
      {s.fontScript && (
        // eslint-disable-next-line @next/next/no-page-custom-font
        <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(s.fontScript).replace(/%20/g, '+')}&display=swap`} />
      )}

      {/* HERO */}
      <section className={css.hero}>
        <div className={css.heroBg} aria-hidden="true">
          {s.heroImage && <Fit src={s.heroImage} w={1600} eager />}
        </div>
        <div className={css.heroIn}>
          <h1><Lines text={s.heroTitle} /></h1>
          {s.heroScript && <p className={css.script}><Lines text={s.heroScript} /></p>}
          <div className={css.divider} aria-hidden="true"><i /></div>
          {s.heroSubtitle && <p className={css.lead}>{s.heroSubtitle}</p>}
          <div className={css.actions}>
            {s.heroBtn1 && (
              <Link href={s.heroBtn1Href || '/collections'} className={`${css.btn} ${css.btnGhost}`}>
                {s.heroBtn1} <ArrowRight size={16} />
              </Link>
            )}
            {s.heroBtn2 && (
              <Link href={s.heroBtn2Href || '/collections'} className={`${css.btn} ${css.btnGhost}`}>
                {s.heroBtn2} <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* CREATION TILES */}
      {tiles.length > 0 && (
        <section className={css.tiles} aria-label={s.coupleTitle || 'Our creations'}>
          {tiles.map((t, i) => (
            <Link key={i} href={t.href || '/collections'} className={css.tile}>
              {t.image && <Fit src={t.image} w={900} />}
              <div className={css.tileBody}>
                <h3><Lines text={t.title} /></h3>
                {t.text && <p><Lines text={t.text} /></p>}
              </div>
              <span className={css.tileArrow} aria-label={t.linkText || 'View collection'}>
                <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </section>
      )}

      {/* ABOUT */}
      <section className={css.about} id="about">
        {aboutImg && (
          <div className={css.aboutImg}><Fit src={aboutImg} w={1200} /></div>
        )}
        <div className={css.aboutBody}>
          {s.aboutEyebrow && <span className={css.eyebrow}>{s.aboutEyebrow}</span>}
          <h2>{s.aboutTitle || s.storeName}</h2>
          {s.about && <p>{s.about}</p>}
          {s.aboutScript && <p className={css.script}>{s.aboutScript}</p>}
          {s.aboutBtnText && (
            <Link href={s.aboutBtnHref || '/about'} className={`${css.btn} ${css.btnOutline}`}>
              {s.aboutBtnText} <ArrowRight size={16} />
            </Link>
          )}
        </div>
        <Floral />
      </section>

      {/* GALLERY STRIP */}
      {gallery.length > 0 && (
        <section className={css.strip} aria-label="Gallery">
          {gallery.map((src, i) => (
            <Link key={i} href="/gallery" className={css.stripItem}>
              <Fit src={src} w={600} />
            </Link>
          ))}
        </section>
      )}

      {/* CTA BAND */}
      <section className={css.cta}>
        <div className={css.ctaIn}>
          <span className={css.ctaLine} aria-hidden="true" />
          <div className={css.ctaText}>
            <p className={css.ctaTitle}>{s.ctaTitle}</p>
            {s.ctaSub && <p className={css.ctaSub}>{s.ctaSub}</p>}
          </div>
          <Link href={bookHref} className={`${css.btn} ${css.btnGhost}`}>
            <CalendarDays size={16} /> {s.bookText}
          </Link>
          <span className={css.ctaLine} aria-hidden="true" />
        </div>
      </section>

      {/* CONTACT */}
      <section className={css.contact} id="contact">
        <div className={css.contactIn}>
          <div className={css.contactInfo}>
            {s.contactEyebrow && <span className={css.eyebrow}>{s.contactEyebrow}</span>}
            <h2>{s.contactTitle}</h2>
            {s.contactText && <p className={css.contactText}>{s.contactText}</p>}
            <ul className={css.contactList}>
              {s.address && (<li><MapPin size={18} /><span>{s.address}</span></li>)}
              {s.hours && (<li><Clock size={18} /><span>{s.hours}</span></li>)}
              {s.phone && (<li><Phone size={18} /><a href={`tel:${s.phone}`}>{s.phone}</a></li>)}
              {s.email && (<li><Mail size={18} /><a href={`mailto:${s.email}`}>{s.email}</a></li>)}
            </ul>
            <div className={css.actions}>
              {s.mapUrl && (
                <a className={`${css.btn} ${css.btnOutline}`} href={s.mapUrl} target="_blank" rel="noopener noreferrer">
                  <Navigation size={16} /> {s.directionsText || 'Get directions'}
                </a>
              )}
              {s.whatsapp && (
                <a className={`${css.btn} ${css.btnSolid}`} target="_blank" rel="noopener noreferrer"
                  href={`https://wa.me/${digits(s.whatsapp)}?text=${encodeURIComponent(s.waText || '')}`}>
                  <MessageCircle size={16} /> {s.whatsappBtnText || 'Chat on WhatsApp'}
                </a>
              )}
            </div>
          </div>
          {(mapOk || s.contactImage) && (
            <div className={css.contactMedia}>
              {mapOk ? (
                <iframe src={mapSrc} title="Studio location" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              ) : (
                <Fit src={s.contactImage} w={1000} />
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}