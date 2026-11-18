import Link from 'next/link';
import { Sparkles, Users, Search, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { getCategories, getProducts } from '@/lib/data';
import { AUDIENCES } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'All Collections | Men, Women, Kids & Family Combos | Sharu Studio',
  description: 'Explore bespoke tailoring collections: Men shirts, kurtas, suits; Women bridal blouses, lehengas, gowns; Kids pattu pavadai, kurta sets, and matching family combos.',
  alternates: { canonical: '/collections' },
};

export default async function Collections({ searchParams }) {
  const { audience = '', category = '', q = '' } = searchParams;

  const [cats, products] = await Promise.all([
    getCategories({ audience: audience || undefined }),
    getProducts({ audience, category, q, limit: 120 }),
  ]);

  const href = (o) => {
    const params = new URLSearchParams(
      Object.entries({ audience, category, q, ...o }).filter(([, v]) => v)
    );
    const qs = params.toString();
    return `/collections${qs ? `?${qs}` : ''}`;
  };

  return (
    <>
      <div className="page-head">
        <div className="container">
          <span className="badge" style={{ marginBottom: 8 }}>BESPOKE ATELIER</span>
          <h1>Tailored Collections</h1>
          <p className="lead" style={{ marginTop: 8 }}>
            Discover our complete range of handcrafted menswear, bridal & festive womenswear, kids attire, and coordinated family sets.
          </p>

          {/* Audience Filter Pills */}
          <div className="filters" aria-label="Who is it for">
            <Link href={href({ audience: '', category: '' })} className={`chip ${!audience ? 'on' : ''}`}>
              <Sparkles size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: -1 }} /> All Collections
            </Link>
            {AUDIENCES.map((a) => (
              <Link
                key={a.key}
                href={href({ audience: a.key, category: '' })}
                className={`chip ${audience === a.key ? 'on' : ''}`}
              >
                {a.key === 'family' ? (
                  <>
                    <Users size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: -1 }} /> Family & Groups
                  </>
                ) : (
                  a.label
                )}
              </Link>
            ))}
          </div>

          {/* Category Filter Pills (if any) */}
          {cats.length > 0 && (
            <div className="filters sub-filters" aria-label="Categories">
              <Link href={href({ category: '' })} className={`chip sm ${!category ? 'on' : ''}`}>
                All Garments
              </Link>
              {cats.map((c) => (
                <Link
                  key={c._id || c.slug}
                  href={href({ category: c.slug })}
                  className={`chip sm ${category === c.slug ? 'on' : ''}`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}

          {/* Search Bar */}
          <form className="search" action="/collections">
            {audience && <input type="hidden" name="audience" value={audience} />}
            {category && <input type="hidden" name="category" value={category} />}
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by garment, fabric or style (e.g. Silk, Shirt, Lehenga)..."
              aria-label="Search"
            />
            <button className="btn sm" type="submit" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Search size={14} /> Search
            </button>
          </form>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 36 }}>
        <div className="container">
          <div className="collections-meta-bar">
            <span>
              Showing <strong>{products.length}</strong> bespoke pieces
              {audience ? ` in ${audience === 'family' ? 'Family & Groups' : audience}` : ''}
              {category ? ` • category: ${category}` : ''}
            </span>
            {(audience || category || q) && (
              <Link href="/collections" className="clear-filter-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <X size={13} /> Clear all filters
              </Link>
            )}
          </div>

          {products.length ? (
            <div className="prod-grid">
              {products.map((p) => (
                <ProductCard key={p._id} p={p} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <p style={{ fontSize: '1.2rem', marginBottom: 12 }}>No dresses found matching your selection.</p>
              <Link href="/collections" className="btn sm">
                View All Collections
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
