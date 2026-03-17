import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { AppProvider } from '@/context/AppContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const playfair = Playfair_Display({
  subsets:  ['latin'],
  variable: '--font-serif',
  display:  'swap',
});

const inter = Inter({
  subsets:  ['latin'],
  variable: '--font-sans',
  display:  'swap',
});

export const metadata: Metadata = {
  title:       'ANNAYA — Royal Boutique',
  description: 'Premium feminine fashion — sarees, lehengas, kurtis & more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-lavender-bg text-primary-text font-sans antialiased">
        <UserProvider>
          <AppProvider>
            <Navigation />
            <main>{children}</main>
            <Footer />
          </AppProvider>
        </UserProvider>
        <Analytics />
      </body>
    </html>
  );
}
