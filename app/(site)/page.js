import Link from 'next/link';
import { Ruler, ArrowRight, MessageCircle, Navigation } from 'lucide-react';
import Img from '@/components/Img';
import ProductCard from '@/components/ProductCard';
import ThemeStyle from '@/components/ThemeStyle';
import { getSettings, getProducts } from '@/lib/data';
import { digits } from '@/lib/utils';
import css from './home.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const s = await getSettings();
  return {
    title: `${s.storeName || 'Sharu The Design Studio'} | ${s.tagline || 'Bridal & Groom Wedding Wear, Made to Measure'}`,
    description: s.heroSubtitle,
    alternates: { canonical: '/' },
  };
}

const BRIDE_WORDS = /bridal|bride|wedding|lehenga|blouse|saree|sari|reception|engagement|jiffa/i;
const GROOM_WORDS = /groom|wedding|sherwani|suit|kurta|jodhpuri|waistcoat|bandhgala|reception|engagement/i;
const text = (p) => [p.name, p.description, p.category?.name, p.fabric].filter(Boolean).join(' ');

export default async function Home() {
  const [s, all] = await Promise.all([getSettings(), getProducts({ limit: 120 })]);

  const women = all.filter((p) => p.audience === 'women');
  const men = all.filter((p) => p.audience === 'men');
  const brides = women.filter((p) => BRIDE_WORDS.test(text(p)));
  const grooms = men.filter((p) => GROOM_WORDS.test(text(p)));
  const brideList = (brides.length ? brides : women).slice(0, 4);
  const groomList = (grooms.length ? grooms : men).slice(0, 4);

  const brideImg = s.brideImage || brideList[0]?.images?.[0];
  const groomImg = s.groomImage || groomList[0]?.images?.[0];
  const tape = s.tape.split(',').map((t) => t.trim()).filter(Boolean);
  const flex = { display: 'inline-flex', alignItems: 'center', gap: 8 };
  const darkBg = s.measureBg
    ? { backgroundImage: `linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.6)),url(${s.measureBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined;

  const coupleBg = s.coupleBg
    ? { backgroundImage: `linear-gradient(color-mix(in srgb, var(--c-bg) 88%, transparent), color-mix(in srgb, var(--c-bg) 88%, transparent)), url(${s.coupleBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined;

  return (
    <main className={`theme ${css.page}`}>
      <ThemeStyle s={s} />

      <section className={css.hero}>
        <div className={css.heroBg} aria-hidden="true">
          <Img src={s.heroImage || brideImg} alt="" w={1600} loading="eager" />
        </div>
        <div className={`${css.wrap} ${css.heroIn}`}>
          <div className={css.heroCopy}>
            <h1>{s.heroTitle}</h1>
            <p className={css.lead}>{s.heroSubtitle}</p>
            <div className={css.actions}>
              <Link href="/collections?audience=women" className={css.btn}>{s.heroBtn1}</Link>
              <Link href="/collections?audience=men" className={`${css.btn} ${css.btnGhost}`}>{s.heroBtn2}</Link>
            </div>
          </div>
        </div>
      </section>

      {tape.length > 0 && (
        <div className={css.tape} aria-hidden="true">
          <div className={css.track}>{[...tape, ...tape].map((t, i) => (<span key={i}>{t}</span>))}</div>
        </div>
      )}

      {s.coupleTiles.length > 0 && (
        <section className={css.section} style={coupleBg}>
          <div className={css.wrap}>
            <div className={css.head}>
              <div><h2>{s.coupleTitle}</h2><p>{s.coupleSub}</p></div>
            </div>
            <div className={css.aud} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {s.coupleTiles.map((t, i) => (
                <Link key={i} href={t.href || '/collections'} className={css.tile}>
                  {t.image && <Img src={t.image} alt="" w={900} />}
                  <div className={css.tileBody}>
                    <h3>{t.title}</h3>
                    {t.text && <p>{t.text}</p>}
                    <span>{t.linkText || 'View collection'} <ArrowRight size={16} /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={`${css.section} ${css.prodWrap}`}>
        <div className={css.wrap}>
          <div className={css.head}>
            <div><h2>{s.brideTitle}</h2><p>{s.brideSub}</p></div>
            <Link href="/collections?audience=women" className={`${css.btn} ${css.btnGhost}`}>View all</Link>
          </div>
          {brideList.length ? (
            <div className={css.grid}>{brideList.map((p) => (<ProductCard key={p._id} p={p} />))}</div>
          ) : (<div className={css.empty}>New pieces are being added. Visit the studio to see them in person.</div>)}
        </div>
      </section>

      <section className={`${css.section} ${css.wrap}`}>
        <div className={css.head}>
          <div><h2>{s.groomTitle}</h2><p>{s.groomSub}</p></div>
          <Link href="/collections?audience=men" className={`${css.btn} ${css.btnGhost}`}>View all</Link>
        </div>
        {groomList.length ? (
          <div className={css.grid}>{groomList.map((p) => (<ProductCard key={p._id} p={p} />))}</div>
        ) : (<div className={css.empty}>New pieces are being added. Visit the studio to see them in person.</div>)}
      </section>

      <section className={`${css.section} ${css.dark}`} id="measurements" style={darkBg}>
        <div className={css.wrap}>
          <div className={css.split}>
            <h2>{s.measureTitle}</h2>
            <div>
              <p className={css.lead}>{s.measureText}</p>
              <Link href="/measurements" className={css.btn} style={flex}><Ruler size={18} /> {s.measureBtn}</Link>
            </div>
          </div>
          <ol className={css.steps}>
            {s.steps.map((st, i) => (
              <li key={i} className={css.step}><b>{i + 1}</b><h3>{st.title}</h3><p>{st.text}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${css.section} ${css.wrap} ${css.visit}`} id="visit">
        <div><h2>{s.visitTitle}</h2><p className={css.lead}>{s.about}</p></div>
        <div className={css.card}>
          <dl>
            {s.address && (<div><dt>Studio address</dt><dd>{s.address}</dd></div>)}
            {s.hours && (<div><dt>Hours</dt><dd>{s.hours}</dd></div>)}
            {s.phone && (<div><dt>Phone</dt><dd><a href={`tel:${s.phone}`}>{s.phone}</a></dd></div>)}
          </dl>
          <div className={css.actions}>
            {s.mapUrl && (
              <a className={css.btn} href={s.mapUrl} target="_blank" rel="noopener noreferrer"><Navigation size={16} /> Get directions</a>
            )}
            {s.whatsapp && (
              <a className={`${css.btn} ${css.btnGhost}`} target="_blank" rel="noopener noreferrer"
                href={`https://wa.me/${digits(s.whatsapp)}?text=${encodeURIComponent(s.waText)}`}>
                <MessageCircle size={16} /> Chat on WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}