import type { Metadata } from 'next';
import './globals.css';
import { getSiteSettings } from '../lib/sanity';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    openGraph: settings.seoImage ? { images: [settings.seoImage] } : undefined,
    icons: {
      icon: [{ url: '/favicon_ewote.svg', type: 'image/svg+xml' }],
      shortcut: '/favicon_ewote.svg',
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
