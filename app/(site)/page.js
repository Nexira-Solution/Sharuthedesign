import Link from 'next/link';
import { Ruler, ArrowRight, MessageCircle, Navigation } from 'lucide-react';
import Img from '@/components/Img';
import Reveal from '@/components/Reveal';
import Tape from '@/components/Tape';
import ProductCard from '@/components/ProductCard';
import { getSettings, getCategories, getProducts } from '@/lib/data';
import { AUDIENCES, digits } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Sharu The Design Studio | Bespoke Tailoring Atelier for Men, Women & Kids',
  description: 'Handcrafted bespoke shirts, kurtas, suits, bridal blouses, lehengas, kids ethnic wear, and coordinated family matching sets. Send your measurements online from anywhere.',
  alternates: { canonical: '/' },
};

const audienceBlurbs = {
  men: 'Shirts (Half & Full Hand), Silk Jiffa, Executive Outfits, Suits, Trousers & Tracks',
  women: 'Designer Saree Blouses, Flared Kurtis, Bridal Lehengas, Salwars & Evening Gowns',
  kids: 'Boys Traditional Kurta & Suits, Girls Pattu Pavadai & Princess Frocks',
  family: 'Harmonized Matching Sets for Couples, Father-Son, Mother-Daughter & Whole Family',
};

const audienceCovers = {
  men: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80',
  women: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80',
  kids: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=700&q=80',
  family: 'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=700&q=80',
};

export default async function Home() {
  const [s, cats, featured, all] = await Promise.all([
    getSettings(),
    getCategories(),
    getProducts({ featured: true, limit: 8 }),
    getProducts({ limit: 80 }),
  ]);

  const list = featured.length ? featured : all.slice(0, 8);
  const cover = (a) => all.find((p) => p.audience === a)?.images?.[0] || audienceCovers[a];

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="badge" style={{ marginBottom: 12, letterSpacing: '0.08em' }}>
              BESPOKE ATELIER • WORLDWIDE SIZING
            </span>
            <h1>{s.heroTitle}</h1>
            <p className="lead">{s.heroSubtitle}</p>
            <div className="hero-actions">
              <Link href="/collections" className="btn">
                Explore All Collections
              </Link>
              <Link href="/measurements" className="btn ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Ruler size={16} /> Send My Measurements Online
              </Link>
            </div>
          </div>
          <div className="hero-art">
            {s.heroImage ? (
              <Img className="cover" src={s.heroImage} alt={s.storeName} w={1200} loading="eager" />
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="mark" src="/logo-light.png" alt={s.storeName} />
                <span className="legend">Men • Women • Kids • Family Sets</span>
              </>
            )}
          </div>
        </div>
        <div className="container">
          <Tape />
        </div>
      </section>

      {/* Target Audiences Grid */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="badge ok">EXPLORE BY GROUP</span>
              <h2>Dressing the Whole Family</h2>
            </div>
            <p className="lead">
              Select who you are dressing today. Every garment is cut to individual measurements.
            </p>
          </div>
          <div className="aud-grid">
            {AUDIENCES.map((a) => (
              <Link key={a.key} href={`/collections?audience=${a.key}`} className="aud-tile">
                <Img src={cover(a.key)} alt={a.label} w={700} />
                <div>
                  <h3>{a.label}</h3>
                  <p>{audienceBlurbs[a.key]}</p>
                  <span className="aud-tile-cta" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    View Collection <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Garment Categories Grid */}
      {cats.length > 0 && (
        <section className="section soft">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="badge">TAILORED FUNCTIONS</span>
                <h2>For Every Milestone & Function</h2>
              </div>
              <p className="lead">
                Weddings, temple muhurthams, executive office days, festivals, and coordinated family celebrations.
              </p>
            </div>
            <div className="cat-grid">
              {cats.slice(0, 12).map((c) => (
                <Link
                  key={c._id || c.slug}
                  href={`/collections?category=${c.slug}`}
                  className={`cat-tile ${c.image ? '' : 'plain'}`}
                >
                  {c.image && <Img src={c.image} alt={c.name} w={600} />}
                  <span>{c.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Pieces */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="badge ok">HANDCRAFTED COUTURE</span>
              <h2>{featured.length ? 'Featured Masterpieces' : 'Latest Studio Creations'}</h2>
            </div>
            <Link href="/collections" className="btn ghost sm">
              View All Pieces ({all.length})
            </Link>
          </div>

          {list.length ? (
            <div className="prod-grid">
              {list.map((p, i) => (
                <Reveal key={p._id} delay={(i % 4) * 0.06}>
                  <ProductCard p={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="empty">
              New pieces are being added to our atelier. Please check back soon or visit the studio.
            </div>
          )}
        </div>
      </section>

      {/* Far Away / Custom Measurement Wizard Callout */}
      <section className="section dark" id="measurements">
        <div className="container">
          <div className="how-split">
            <div>
              <span className="badge" style={{ background: '#222', borderColor: '#444', color: '#fff', marginBottom: 12 }}>
                WORLDWIDE BESPOKE SIZING
              </span>
              <h2>Living abroad? Get a master tailor fit anyway.</h2>
            </div>
            <div>
              <p className="lead">
                Living in the USA, UK, Singapore, Malaysia, or outside Chennai? Follow our step-by-step illustrated picture guides, measure yourself at home, and send the numbers. We stitch to your exact posture and ease.
              </p>
              <div className="hero-actions" style={{ marginTop: 20 }}>
                <Link href="/measurements" className="btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Ruler size={16} /> Start Step-by-Step Measuring
                </Link>
              </div>
            </div>
          </div>

          <div className="how">
            <div>
              <h3>1. Choose Who</h3>
              <p>Men, Women, Kids, or Family & Group matching sets.</p>
            </div>
            <div>
              <h3>2. Choose Dress</h3>
              <p>Shirts (half/full hand), Jiffa, Blouse, Kurti, Lehenga, Suits, Pants, Tracks.</p>
            </div>
            <div>
              <h3>3. Follow Pictures</h3>
              <p>Each measurement point has an illustrated diagram and tailor tip.</p>
            </div>
            <div>
              <h3>4. Review & Send</h3>
              <p>Our master cutter receives your cut sheet and starts tailoring.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Visit & Contact */}
      <section className="section" id="visit">
        <div className="container visit-grid">
          <div>
            <span className="badge" style={{ marginBottom: 12 }}>STUDIO & ATELIER</span>
            <h2 style={{ fontSize: 'clamp(28px,4vw,46px)', marginBottom: 16 }}>Visit the Studio</h2>
            <p className="lead">{s.about}</p>
          </div>
          <dl>
            {s.address && (
              <div>
                <dt>Studio Address</dt>
                <dd>{s.address}</dd>
              </div>
            )}
            {s.hours && (
              <div>
                <dt>Atelier Hours</dt>
                <dd>{s.hours}</dd>
              </div>
            )}
            {s.phone && (
              <div>
                <dt>Phone Inquiries</dt>
                <dd>
                  <a href={`tel:${s.phone}`}>{s.phone}</a>
                </dd>
              </div>
            )}
            <div className="hero-actions" style={{ marginTop: 12 }}>
              {s.mapUrl && (
                <a className="btn" href={s.mapUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Navigation size={15} /> Get Directions
                </a>
              )}
              {s.whatsapp && (
                <a
                  className="btn ghost"
                  href={`https://wa.me/${digits(s.whatsapp)}?text=${encodeURIComponent(
                    'Hello Sharu Studio, I would like to schedule an in-person fitting consultation.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <MessageCircle size={15} /> Chat on WhatsApp
                </a>
              )}
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
