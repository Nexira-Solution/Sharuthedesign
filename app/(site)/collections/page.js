import Link from 'next/link';
import { Playfair_Display, Inter } from 'next/font/google';
import { Search, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { getCategories, getProducts } from '@/lib/data';
import { AUDIENCES } from '@/lib/utils';
import css from './collections.module.css';

const display = Playfair_Display({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-display', display: 'swap' });
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

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
    const params = new URLSearchParams(Object.entries({ audience, category, q, ...o }).filter(([, v]) => v));
    const qs = params.toString();
    return `/collections${qs ? `?${qs}` : ''}`;
  };
  const audLabel = (a) => (a.key === 'family' ? 'Family & Groups' : a.label);
  const current = audienceName(audience);

  function audienceName(k) {
    const a = AUDIENCES.find((x) => x.key === k);
    return a ? audLabel(a) : '';
  }

  return (
    <main className={`${css.page} ${display.variable} ${body.variable}`}>
      <header className={css.top}>
        <div className={css.wrap}>
          <h1>Tailored collections</h1>
        </div>
      </header>

      <div className={`${css.wrap} ${css.layout}`}>
        <aside className={css.side}>
          <form className={css.search} action="/collections" role="search">
            {audience && <input type="hidden" name="audience" value={audience} />}
            {category && <input type="hidden" name="category" value={category} />}
            <input name="q" defaultValue={q} placeholder="Search silk, shirt, lehenga" aria-label="Search" />
            <button type="submit" aria-label="Search"><Search size={18} /></button>
          </form>

          <div className={css.group}>
            <p className={css.gt}>For</p>
            <nav className={css.chips} aria-label="Who is it for">
              <Link href={href({ audience: '', category: '' })} className={`${css.chip} ${!audience ? css.on : ''}`}>All</Link>
              {AUDIENCES.map((a) => (
                <Link key={a.key} href={href({ audience: a.key, category: '' })} className={`${css.chip} ${audience === a.key ? css.on : ''}`}>
                  {audLabel(a)}
                </Link>
              ))}
            </nav>
          </div>

          {cats.length > 0 && (
            <div className={css.group}>
              <p className={css.gt}>Garment</p>
              <nav className={css.chips} aria-label="Categories">
                <Link href={href({ category: '' })} className={`${css.chip} ${css.chipSm} ${!category ? css.on : ''}`}>All garments</Link>
                {cats.map((c) => (
                  <Link key={c._id || c.slug} href={href({ category: c.slug })} className={`${css.chip} ${css.chipSm} ${category === c.slug ? css.on : ''}`}>
                    {c.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </aside>

        <section>
          <div className={css.meta}>
            <span>
              <b>{products.length}</b> {products.length === 1 ? 'piece' : 'pieces'}
              {current ? ` for ${current}` : ''}
            </span>
            {(audience || category || q) && (
              <Link href="/collections" className={css.clear}><X size={14} /> Clear filters</Link>
            )}
          </div>

          {products.length ? (
            <div className={css.grid}>
              {products.map((p) => (<ProductCard key={p._id} p={p} />))}
            </div>
          ) : (
            <div className={css.empty}>
              <p>No pieces match your selection.</p>
              <Link href="/collections" className={css.btn}>View all collections</Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}