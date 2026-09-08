import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'EWOTE — Creative team',
  description: 'EWOTE. Film, image and creative direction.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
  },
};
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
