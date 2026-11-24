import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Playfair_Display, Inter } from 'next/font/google';
import { Users, Ruler, MessageCircle, Sparkles, Palette, ArrowLeft } from 'lucide-react';
import Gallery from '@/components/Gallery';
import ProductCard from '@/components/ProductCard';
import { getProduct, getProducts, getSettings } from '@/lib/data';
import { audienceLabel, digits, isFamilyAudience } from '@/lib/utils';
import css from './product.module.css';

const display = Playfair_Display({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-display', display: 'swap' });
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

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
  const aud = isCombo ? 'family' : p.audience;

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

  const wa = s.whatsapp
    ? `https://wa.me/${digits(s.whatsapp)}?text=${encodeURIComponent(`Hello Sharu Studio, I am interested in custom-tailoring: ${p.name}`)}`
    : null;

  const Actions = ({ bar }) => (
    <>
      <Link href={`/measurements?audience=${aud}`} className={css.btn}>
        <Ruler size={18} /> Send measurements
      </Link>
      {wa && (
        <a className={`${css.btn} ${css.ghost}`} href={wa} target="_blank" rel="noopener noreferrer" aria-label="Ask on WhatsApp">
          <MessageCircle size={18} /> {!bar && 'Ask on WhatsApp'}
        </a>
      )}
    </>
  );

  return (
    <main className={`${css.page} ${display.variable} ${body.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <div className={`${css.wrap} ${css.backRow}`}>
        <Link href={`/collections?audience=${aud}`} className={css.back} aria-label="Back to collections">
          <ArrowLeft size={18} /> Back
        </Link>
      </div>

      <div className={`${css.wrap} ${css.main}`}>
        <div className={css.media}>
          <Gallery images={p.images} alt={p.name} productName={p.name} />
        </div>

        <div className={css.info}>
          <div className={css.tags}>
            <span className={css.tag}>{audienceLabel(p.audience)}</span>
            {p.category && (
              <Link className={css.tag} href={`/collections?category=${p.category.slug}`}>{p.category.name}</Link>
            )}
            {isCombo && (
              <span className={`${css.tag} ${css.tagGold}`}><Users size={14} /> Family combo</span>
            )}
          </div>

          <h1>{p.name}</h1>
          {p.description && <p className={css.desc}>{p.description}</p>}

          {(p.fabric || p.colors?.length > 0) && (
            <dl className={css.specs}>
              {p.fabric && (
                <div className={css.spec}>
                  <dt><Sparkles size={14} /> Fabric</dt>
                  <dd>{p.fabric}</dd>
                </div>
              )}
              {p.colors?.length > 0 && (
                <div className={css.spec}>
                  <dt><Palette size={14} /> Colors</dt>
                  <dd>{p.colors.join(', ')}</dd>
                </div>
              )}
            </dl>
          )}

          {p.comboPieces?.length > 0 && (
            <div className={css.combo}>
              <h3>Outfits included</h3>
              <ul>
                {p.comboPieces.map((piece, i) => (
                  <li key={i}>
                    {piece.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={piece.image} alt={piece.label || 'Outfit'} />
                    )}
                    <div>
                      <b>{piece.label}</b>
                      <span>{piece.garmentType}{piece.audience ? `, ${piece.audience}` : ''}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={css.cta}><Actions /></div>
        </div>
      </div>

      <div className={css.bar}><Actions bar /></div>

      {rel.length > 0 && (
        <section className={css.related}>
          <div className={css.wrap}>
            <div className={css.rhead}>
              <h2>More in {audienceLabel(p.audience)}</h2>
              <Link href={`/collections?audience=${aud}`} className={`${css.btn} ${css.ghost}`}>View all</Link>
            </div>
            <div className={css.grid}>
              {rel.map((r) => (<ProductCard key={r._id} p={r} />))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}