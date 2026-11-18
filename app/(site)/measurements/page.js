import MeasureWizard from '@/components/MeasureWizard';
import { getCategories, getGuides } from '@/lib/data';

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

export default async function Measurements({ searchParams }) {
  const [guides, categories] = await Promise.all([getGuides(), getCategories()]);

  return (
    <>
      <div className="page-head">
        <div className="container">
          <span className="badge" style={{ marginBottom: 8 }}>ATELIER MEASUREMENT STUDIO</span>
          <h1>Send Your Measurements</h1>
          <p className="lead" style={{ marginTop: 10 }}>
            Living abroad or unable to visit the studio in person? Follow our illustrated picture guides, measure at home with comfort ease, and our master tailors will hand-cut and stitch to your fit.
          </p>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <MeasureWizard
            guides={guides}
            categories={categories}
            initialAudience={searchParams.audience}
          />
        </div>
      </section>
    </>
  );
}
