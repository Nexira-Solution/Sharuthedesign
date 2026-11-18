import './globals.css';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const NAME = 'Sharu The Design Studio';

export const metadata = {
  metadataBase: new URL(SITE),
  title: { default: `${NAME} | Boutique for Men, Women & Kids`, template: `%s | ${NAME}` },
  description: 'Boutique for men, women and kids. Wedding wear, office wear, party wear, lehengas, kurthis and matching outfits for families and groups. Send your measurements from anywhere.',
  keywords: ['boutique', 'men wear', 'women wear', 'kids wear', 'wedding wear', 'lehenga', 'kurthi', 'family matching dress', 'custom stitching', 'Sharu The Design Studio'],
  openGraph: { type: 'website', siteName: NAME, title: NAME, description: 'Boutique for Men, Women & Kids - custom fit from your measurements.', images: ['/logo-dark.png'] },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
};
export const viewport = { themeColor: '#000000', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&family=Marcellus&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
