import type { Metadata } from 'next';
import { Libre_Franklin } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const libreFranklin = Libre_Franklin({
  subsets: ['latin'],
  variable: '--font-libre-franklin',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MOULEETA — Crafted Consciously',
  description: 'An architectural study in wear. 100% pure linen silhouettes designed for the modern minimalist. Sustainable, high-end structured clothing.',
  openGraph: {
    title: 'MOULEETA — Crafted Consciously',
    description: 'An architectural study in wear. 100% pure linen silhouettes designed for the modern minimalist.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${libreFranklin.variable} h-full antialiased no-scrollbar`}
    >
      <body className="min-h-full flex flex-col bg-bone-surface text-onyx-foreground font-libre-franklin">
        {/* Persistent Premium Navigation Header */}
        <NavBar cartCount={1} />
        
        {/* Main page content wrapper */}
        <main className="flex-grow pt-20">
          {children}
        </main>
        
        {/* Persistent Premium Footer */}
        <Footer />
      </body>
    </html>
  );
}
