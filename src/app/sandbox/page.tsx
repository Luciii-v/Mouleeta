import React from 'react';
import Image from 'next/image';
import { getProducts } from '@/lib/shopify';
import SandboxProductCard from '@/components/SandboxProductCard';
import { ChevronDown } from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

export default async function GridTestPage() {
  const activeProducts = await getProducts();
  const rawProducts = activeProducts.map(p => ({
    node: {
      id: p.id,
      title: p.title,
      handle: p.handle,
      description: p.description,
      priceRange: {
        minVariantPrice: {
          amount: p.priceRange.minVariantPrice.amount,
          currencyCode: p.priceRange.minVariantPrice.currencyCode || 'INR'
        }
      },
      images: p.images,
      featuredImage: p.images?.edges?.[0]?.node ? { url: p.images.edges[0].node.url } : undefined,
      variants: p.variants
    }
  }));

  // Use a stunning campaign/lifestyle image, or fallback to the first product image
  const heroImageUrl = rawProducts[2]?.node?.featuredImage?.url || rawProducts[0]?.node?.featuredImage?.url || '/placeholder.png';

  return (
    <main className="min-h-screen bg-[#FDFBF7]">
      
      {/* 100vh Immersive Hero Section */}
      <div className="relative w-full h-[100dvh] bg-[#1A1A1A]">
        <Image
          src={heroImageUrl}
          alt="The Lookbook Collection"
          fill
          priority
          className="object-cover opacity-80"
          draggable={false}
        />
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

        {/* Hero Title */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
          <span className="font-metropolis font-medium text-[10px] md:text-[12px] uppercase tracking-[0.4em] text-white/80 mb-6 drop-shadow-md">
            Spring / Summer 2026
          </span>
          <h1 className="font-jost font-light text-5xl sm:text-6xl md:text-[90px] text-white tracking-[0.1em] uppercase leading-[1.1] drop-shadow-xl max-w-5xl">
            The Evening <br /> Collection
          </h1>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none animate-bounce">
          <span className="font-metropolis text-[9px] uppercase tracking-[0.3em] text-white/70">Scroll to View Collection</span>
          <ChevronDown size={20} strokeWidth={1} className="text-white/70" />
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 md:py-32">

        {/* The Staggered Waterfall Grid */}
        <div className="
          grid grid-cols-2 md:grid-cols-3 
          gap-x-4 gap-y-12 md:gap-x-12 md:gap-y-24 
          
          /* Mobile Stagger: Push down the right column (even items) */
          [&>*:nth-child(2n)]:translate-y-12
          
          /* Desktop Stagger: Reset mobile, and push down the middle column (3n+2) */
          md:[&>*:nth-child(2n)]:translate-y-0
          md:[&>*:nth-child(3n+2)]:translate-y-24
        ">
          {rawProducts.map((productEdge) => {
            const product = productEdge.node;
            return (
              <div key={product.id} className="w-full relative group">
                <SandboxProductCard product={product} lightBg={true} isSpringCollection={false} />
              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}
