import { getProducts } from '@/lib/data';
export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const products = await getProducts({ limit: 500 });
  return [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/collections`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/measurements`, changeFrequency: 'monthly', priority: 0.9 },
    ...products.map((p) => ({ url: `${base}/collections/${p.slug}`, lastModified: p.updatedAt, priority: 0.7 })),
  ];
}
