import type { Metadata } from "next";
import { Inter, Jost, Montserrat, Playfair_Display } from 'next/font/google';
import './globals.css';

import GrainOverlay from '@/components/GrainOverlay';

import AuthProvider from "@/components/AuthProvider";
import CartDrawer from '@/components/CartDrawer';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MemoryDock from '@/components/MemoryDock';
import CookieConsentToast from '@/components/CookieConsentToast';
import FloatingActionHub from '@/components/FloatingActionHub';
import { getCollectionProducts } from '@/lib/shopify';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jost = Jost({ 
  weight: ['300', '400'], 
  subsets: ['latin'], 
  variable: '--font-jost' 
});
const metropolisFallback = Montserrat({ 
  weight: ['300', '400', '500', '700'], 
  subsets: ['latin'], 
  variable: '--font-metropolis' 
});
const playfair = Playfair_Display({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-editorial'
});

export const metadata: Metadata = {
  title: "MOULEETA — Crafted Consciously",
  description: "Discover our collection of premium, consciously crafted organic linen pieces, where luxury meets sustainability.",
  openGraph: {
    title: "MOULEETA — Crafted Consciously",
    description: "Premium, consciously crafted organic linen pieces, where luxury meets sustainability.",
    url: 'https://mouleeta.shop',
    siteName: 'MOULEETA',
    images: [
      {
        url: 'https://mouleeta.shop/images/og-image.jpg', // Ensure you upload an og-image.jpg to public/images/
        width: 1200,
        height: 630,
        alt: 'MOULEETA Crafted Consciously'
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MOULEETA — Crafted Consciously',
    description: 'Premium, consciously crafted organic linen pieces.',
    images: ['https://mouleeta.shop/images/og-image.jpg'],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const upsellProducts = await getCollectionProducts('new-arrivals');

  return (
    <html lang="en">
      {/* Inject font variables into the body */}
      <body className={`${inter.variable} ${jost.variable} ${metropolisFallback.variable} ${playfair.variable} font-inter antialiased min-h-full flex flex-col`}>
        <AuthProvider>

          <GrainOverlay />

          <Header />
          <CartDrawer upsellProducts={upsellProducts} />
          <MemoryDock />
          <CookieConsentToast />
          <FloatingActionHub />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
