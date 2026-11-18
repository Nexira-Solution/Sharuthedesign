import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }) {
  const s = await getSettings();
  const ld = {
    '@context': 'https://schema.org', '@type': 'ClothingStore', name: s.storeName,
    description: s.tagline, url: process.env.NEXT_PUBLIC_SITE_URL, telephone: s.phone || undefined,
    address: s.address ? { '@type': 'PostalAddress', streetAddress: s.address } : undefined,
    openingHours: s.hours || undefined,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Navbar name={s.storeName} />
      <main>{children}</main>
      <Footer s={s} />
    </>
  );
}
