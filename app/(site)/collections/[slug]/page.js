import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Users,
  Ruler,
  Store,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Palette,
  Scissors,
  CheckCheck,
} from 'lucide-react';
import Gallery from '@/components/Gallery';
import ProductCard from '@/components/ProductCard';
import { getProduct, getProducts, getSettings } from '@/lib/data';
import { audienceLabel, digits, isFamilyAudience } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const p = await getProduct(params.slug);
  if (!p) return { title: 'Piece Not Found | Sharu Studio' };
  const desc = (p.description || `${p.name} from Sharu The Design Studio`).slice(0, 155);
  return {
    title: `${p.name} | Sharu The Design Studio`,
    description: desc,
    alternates: { canonical: `/collections/${p.slug}` },
    openGraph: {
      title: `${p.name} | Sharu The Design Studio`,
      description: desc,
      images: p.images?.[0] ? [{ url: p.images[0], width: 1200, height: 800, alt: p.name }] : undefined,
    },
  };
}

export default async function ProductPage({ params }) {
  const p = await getProduct(params.slug);
  if (!p) notFound();

  const [s, related] = await Promise.all([
    getSettings(),
    getProducts({ audience: p.audience, limit: 5 }),
  ]);
  const rel = related.filter((r) => String(r._id) !== String(p._id)).slice(0, 4);

  const isCombo = isFamilyAudience(p.audience) || p.groupMatching;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: p.images,
    category: p.category?.name,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      price: p.price ? p.price.replace(/\D/g, '') || undefined : undefined,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="pd-section">
        <div className="container pd">
          {/* Interactive Luxury Gallery */}
          <Gallery
            images={p.images}
            alt={p.name}
            productName={p.name}
            hotspots={p.hotspots || []}
            colors={p.colors || []}
            fabric={p.fabric}
          />

          <div className="pd-details-col">
            <div className="meta">
              <span className="badge">{audienceLabel(p.audience)}</span>
              {p.category && (
                <Link className="badge" href={`/collections?category=${p.category.slug}`}>
                  {p.category.name}
                </Link>
              )}
              {isCombo && (
                <span className="badge ok" style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Users size={13} /> Family & Group Coordinated Set
                </span>
              )}
            </div>

            <h1>{p.name}</h1>
            {p.price && <div className="pd-price-tag">{p.price} <small>(Bespoke Tailored)</small></div>}

            {p.description && <p className="desc">{p.description}</p>}

            {/* If Family Combo with breakdown pieces */}
            {p.comboPieces?.length > 0 && (
              <div className="combo-breakdown-card">
                <h4>
                  <Users size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -1 }} />
                  Coordinated Outfits Included in This Set:
                </h4>
                <ul>
                  {p.comboPieces.map((piece, idx) => (
                    <li key={idx}>
                      <strong>{piece.label}:</strong> {piece.garmentType} ({piece.audience})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <dl>
              {p.fabric && (
                <div>
                  <dt style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Sparkles size={13} /> Bespoke Fabric
                  </dt>
                  <dd>{p.fabric}</dd>
                </div>
              )}
              {p.colors?.length > 0 && (
                <div>
                  <dt style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Palette size={13} /> Available Colors
                  </dt>
                  <dd>{p.colors.join(', ')}</dd>
                </div>
              )}
              <div>
                <dt style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Scissors size={13} /> Tailoring Method
                </dt>
                <dd>Handcrafted to your individual measurements</dd>
              </div>
              <div>
                <dt style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <CheckCheck size={13} /> Fitting Support
                </dt>
                <dd>Studio trial or doorstep video consultation</dd>
              </div>
            </dl>

            <div className="cta">
              <Link
                href={`/measurements?audience=${isCombo ? 'family' : p.audience}`}
                className="btn"
              >
                <Ruler size={16} /> Send Measurements for this Piece
              </Link>
              <Link href="/#visit" className="btn ghost">
                <Store size={15} /> Visit Studio
              </Link>
              {s.whatsapp && (
                <a
                  className="btn ghost"
                  href={`https://wa.me/${digits(s.whatsapp)}?text=${encodeURIComponent(
                    `Hello Sharu Studio, I am interested in custom-tailoring: ${p.name}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={15} /> Ask on WhatsApp
                </a>
              )}
            </div>

            <div className="note" style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: 2, color: 'var(--ok)' }} />
              <div>
                <strong>Bespoke Tailoring Guarantee:</strong> Every piece is hand-cut and stitched by master tailors with custom ease allowances. We offer complimentary fitting adjustments if needed.
              </div>
            </div>
          </div>
        </div>
      </section>

      {rel.length > 0 && (
        <section className="section soft">
          <div className="container">
            <div className="section-head">
              <h2>More in {audienceLabel(p.audience)}</h2>
              <Link href={`/collections?audience=${isCombo ? 'family' : p.audience}`} className="btn ghost sm">
                View all
              </Link>
            </div>
            <div className="prod-grid">
              {rel.map((r) => (
                <ProductCard key={r._id} p={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
