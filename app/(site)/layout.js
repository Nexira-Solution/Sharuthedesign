import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ThemeVars from '@/components/ThemeVars';
import { getSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }) {
  const s = await getSettings();
  const ld = {
    '@context': 'https://schema.org', '@type': 'ClothingStore', name: s.storeName,
    description: s.tagline, url: process.env.NEXT_PUBLIC_SITE_URL, telephone: s.phone || undefined,
    address: s.address ? { '@type': 'PostalAddress', streetAddress: s.address } : undefined,
    openingHours: s.hours || undefined,
    image: s.heroImage || undefined,
    sameAs: [s.instagram, s.facebook].filter(Boolean),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      {/* Admin colors -> --t-* variables used by every page */}
      <ThemeVars s={s} />
      <Navbar name={s.storeName} s={s} />
      {/* div, not main: each page already renders its own <main> */}
      <div>{children}</div>
      <Footer s={s} />
    </>
  );
}