import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Users,
  Ruler,
  MessageCircle,
  Sparkles,
  Palette,
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
          {/* Minimal Luxury Gallery */}
          <Gallery
            images={p.images}
            alt={p.name}
            productName={p.name}
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
                  <Users size={13} /> Family Combo
                </span>
              )}
            </div>

            <h1>{p.name}</h1>

            {p.description && <p className="desc">{p.description}</p>}

            {/* If Family Combo with breakdown pieces */}
            {p.comboPieces?.length > 0 && (
              <div className="combo-breakdown-card">
                <h4>
                  <Users size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -1 }} />
                  Coordinated Outfits Included:
                </h4>
                <ul>
                  {p.comboPieces.map((piece, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {piece.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={piece.image}
                          alt={piece.label || 'Outfit'}
                          style={{ width: 34, height: 34, objectFit: 'cover', borderRadius: 3, border: '1px solid var(--line)', flexShrink: 0 }}
                        />
                      )}
                      <span>
                        <strong>{piece.label}:</strong> {piece.garmentType} ({piece.audience})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(p.fabric || p.colors?.length > 0) && (
              <dl>
                {p.fabric && (
                  <div>
                    <dt style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Sparkles size={13} /> Fabric
                    </dt>
                    <dd>{p.fabric}</dd>
                  </div>
                )}
                {p.colors?.length > 0 && (
                  <div>
                    <dt style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Palette size={13} /> Colors
                    </dt>
                    <dd>{p.colors.join(', ')}</dd>
                  </div>
                )}
              </dl>
            )}

            <div className="cta">
              <Link
                href={`/measurements?audience=${isCombo ? 'family' : p.audience}`}
                className="btn"
              >
                <Ruler size={16} /> Send Measurements for this Piece
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
