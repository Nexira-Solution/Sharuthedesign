import Link from 'next/link';
import { Playfair_Display, Inter } from 'next/font/google';
import { Ruler, ArrowRight, MessageCircle, Navigation } from 'lucide-react';
import Img from '@/components/Img';
import ProductCard from '@/components/ProductCard';
import { getSettings, getProducts } from '@/lib/data';
import { AUDIENCES, digits } from '@/lib/utils';
import css from './home.module.css';

const display = Playfair_Display({ subsets: ['latin'], weight: ['500', '600', '700'], style: ['normal', 'italic'], variable: '--font-display', display: 'swap' });
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Sharu The Design Studio | Bespoke Tailoring Atelier for Men, Women & Kids',
  description: 'Handcrafted bespoke shirts, kurtas, suits, bridal blouses, lehengas, kids ethnic wear, and coordinated family matching sets. Send your measurements online from anywhere.',
  alternates: { canonical: '/' },
};

const audienceCovers = {
  men: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80',
  women: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80',
  kids: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=700&q=80',
  family: 'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=700&q=80',
};

const TAPE = ['Shirts', 'Kurtas', 'Suits', 'Bridal blouses', 'Lehengas', 'Kids ethnic wear', 'Family sets', 'Jiffa', 'Kurtis'].concat(['Shirts', 'Kurtas', 'Suits']).slice(0, 9);

const STEPS = [
  ['Choose who', 'Men, women, kids, or family and group matching sets.'],
  ['Choose the dress', 'Shirts, jiffa, blouse, kurti, lehenga, suits, pants, tracks.'],
  ['Follow the pictures', 'Every measurement point has a diagram and a tailor tip.'],
  ['Review and send', 'Our master cutter receives your cut sheet and starts stitching.'],
];

export default async function Home() {
  const [s, featured, all] = await Promise.all([
    getSettings(),
    getProducts({ featured: true, limit: 8 }),
    getProducts({ limit: 80 }),
  ]);

  const list = featured.length ? featured : all.slice(0, 8);
  const cover = (a) => all.find((p) => p.audience === a)?.images?.[0] || audienceCovers[a];
  const flex = { display: 'inline-flex', alignItems: 'center', gap: 8 };

  return (
    <main className={`${css.page} ${display.variable} ${body.variable}`}>
      {/* Hero */}
      <section className={css.hero}>
        <div className={css.heroBg} aria-hidden="true">
          <Img src={s.heroImage || cover('family')} alt="" w={1600} loading="eager" />
        </div>
        <div className={`${css.wrap} ${css.heroIn}`}>
          <div className={css.heroCopy}>
            <h1>{s.heroTitle}</h1>
            <p className={css.lead}>{s.heroSubtitle}</p>
            <div className={css.actions}>
              <Link href="/collections" className={css.btn}>Explore collections</Link>
              <Link href="/measurements" className={`${css.btn} ${css.btnGhost}`}>
                <Ruler size={18} /> Send my measurements
              </Link>
            </div>
          </div>
          <div className={css.collage}>
            <Link href="/collections?audience=women" className={`${css.pic} ${css.p1}`} aria-label="Women collection">
              <Img src={cover('women')} alt="" w={900} loading="eager" />
            </Link>
            <Link href="/collections?audience=men" className={`${css.pic} ${css.p2}`} aria-label="Men collection">
              <Img src={cover('men')} alt="" w={600} loading="eager" />
            </Link>
            <Link href="/collections?audience=kids" className={`${css.pic} ${css.p3}`} aria-label="Kids collection">
              <Img src={cover('kids')} alt="" w={600} loading="eager" />
            </Link>
          </div>
        </div>
      </section>
      <div className={css.tape} aria-hidden="true">
        <div className={css.track}>
          {[...TAPE, ...TAPE].map((t, i) => (<span key={i}>{t}</span>))}
        </div>
      </div>

      {/* Categories */}
      <section className={`${css.section} ${css.wrap}`}>
        <div className={css.head}>
          <div>
            <h2>Who are we dressing?</h2>
            <p>Pick a collection to start.</p>
          </div>
        </div>
        <div className={css.aud}>
          {AUDIENCES.map((a) => (
            <Link key={a.key} href={`/collections?audience=${a.key}`} className={css.tile}>
              <Img src={cover(a.key)} alt="" w={700} />
              <div className={css.tileBody}>
                <h3>{a.label}</h3>
                <span>View collection <ArrowRight size={16} /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className={`${css.section} ${css.prodWrap}`}>
        <div className={css.wrap}>
          <div className={css.head}>
            <div>
              <h2>{featured.length ? 'Featured pieces' : 'Latest from the studio'}</h2>
              <p>Handcrafted, made to order.</p>
            </div>
            <Link href="/collections" className={`${css.btn} ${css.btnGhost}`}>View all {all.length} pieces</Link>
          </div>
          {list.length ? (
            <div className={css.grid}>
              {list.map((p) => (
                <ProductCard key={p._id} p={p} />
              ))}
            </div>
          ) : (
            <div className={css.empty}>New pieces are being added. Check back soon or visit the studio.</div>
          )}
        </div>
      </section>

      {/* Measurements */}
      <section className={`${css.section} ${css.dark}`} id="measurements">
        <div className={css.wrap}>
          <div className={css.split}>
            <h2>Living abroad? You still get a master tailor fit.</h2>
            <div>
              <p className={css.lead}>
                In the USA, UK, Singapore, Malaysia, or anywhere outside Chennai? Follow our illustrated guides, measure yourself at home, and send us the numbers. We stitch to your posture and ease.
              </p>
              <Link href="/measurements" className={css.btn} style={flex}>
                <Ruler size={18} /> Start measuring
              </Link>
            </div>
          </div>
          <ol className={css.steps}>
            {STEPS.map(([t, d], i) => (
              <li key={t} className={css.step}>
                <b>{i + 1}</b>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Visit */}
      <section className={`${css.section} ${css.wrap} ${css.visit}`} id="visit">
        <div>
          <h2>Visit the studio</h2>
          <p className={css.lead}>{s.about}</p>
        </div>
        <div className={css.card}>
          <dl>
            {s.address && (<div><dt>Studio address</dt><dd>{s.address}</dd></div>)}
            {s.hours && (<div><dt>Hours</dt><dd>{s.hours}</dd></div>)}
            {s.phone && (<div><dt>Phone</dt><dd><a href={`tel:${s.phone}`}>{s.phone}</a></dd></div>)}
          </dl>
          <div className={css.actions}>
            {s.mapUrl && (
              <a className={css.btn} href={s.mapUrl} target="_blank" rel="noopener noreferrer">
                <Navigation size={16} /> Get directions
              </a>
            )}
            {s.whatsapp && (
              <a
                className={`${css.btn} ${css.btnGhost}`}
                href={`https://wa.me/${digits(s.whatsapp)}?text=${encodeURIComponent('Hello Sharu Studio, I would like to schedule an in-person fitting consultation.')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={16} /> Chat on WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}