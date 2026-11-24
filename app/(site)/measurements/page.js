import Link from 'next/link';
import { Playfair_Display, Inter } from 'next/font/google';
import { ArrowLeft } from 'lucide-react';
import MeasureWizard from '@/components/MeasureWizard';
import { getCategories, getGuides } from '@/lib/data';
import css from './measurements.module.css';

const display = Playfair_Display({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-display', display: 'swap' });
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Custom Measurement Studio | Step-by-Step Fitting Guides | Sharu Studio',
  description:
    'Step-by-step interactive bespoke tailoring measurement guides for Men, Women, Kids & Family matching sets. Measure at home with illustrated tape diagrams and send sizes directly to our master tailors.',
  alternates: { canonical: '/measurements' },
  openGraph: {
    title: 'Custom Measurement Studio | Sharu The Design Studio',
    description:
      'Step-by-step interactive tailor measurement guide with visual diagrams for shirts, kurtas, blouses, lehengas, suits, and kids wear.',
  },
};

const STEPS = [
  ['Choose who', 'Men, women, kids or family sets.'],
  ['Pick the garment', 'Shirt, kurta, blouse, lehenga, suit and more.'],
  ['Follow the pictures', 'Every point has a diagram and a tip.'],
  ['Review and send', 'Our master cutter starts stitching.'],
];

export default async function Measurements({ searchParams }) {
  const [guides, categories] = await Promise.all([getGuides(), getCategories()]);

  return (
    <main className={`${css.page} ${display.variable} ${body.variable}`}>
      <div className={`${css.wrap} ${css.layout}`}>
        <aside className={css.intro}>
          <Link href="/" className={css.back} aria-label="Back to home">
            <ArrowLeft size={18} /> Back
          </Link>
          <h1>Send your measurements</h1>
          <p className={css.lead}>Measure at home and our master tailors will cut and stitch to your fit.</p>
          <ol className={css.steps}>
            {STEPS.map(([t, d], i) => (
              <li key={t} className={css.step}>
                <b>{i + 1}</b>
                <div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>

        <section className={css.stage}>
          <div className={css.inner}>
            <MeasureWizard
              guides={guides}
              categories={categories}
              initialAudience={searchParams.audience}
            />
          </div>
        </section>
      </div>
    </main>
  );
}