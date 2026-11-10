import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'PayPal AI Guardian — Intelligent Payment Protection',
  description: 'Fintech cybersecurity, fraud detection, and sandbox payment protection platform',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#0F172A" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
