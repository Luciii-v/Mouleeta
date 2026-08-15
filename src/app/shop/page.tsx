import { getProducts } from '@/lib/shopify';
import SandboxProductCard from '@/components/SandboxProductCard';
import HeroImageFader from '@/components/HeroImageFader';
import { ChevronDown } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  // Fetching directly on the server—no client side useEffect needed
  const allProducts = await getProducts({});
  const products = allProducts.filter(p => !p.handle.includes('bag'));

  // Get first image from the first 5 products to fade through
  const heroImages = products
    .slice(0, 5)
    .map(p => p.images?.edges?.[0]?.node?.url)
    .filter(Boolean) as string[];

  // Fallback if no images found
  if (heroImages.length === 0) heroImages.push('/placeholder.png');
  // Format products for SandboxProductCard
  const formattedProducts = products.map(p => ({
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

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* 100vh Immersive Hero Section */}
      <div className="relative w-full h-[100dvh] bg-[#1A1A1A]">
        <HeroImageFader 
          images={heroImages} 
          interval={3500} 
          altText="The Complete Collection" 
        />
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

        {/* Hero Title */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
          <span className="font-metropolis font-medium text-[10px] md:text-[12px] uppercase tracking-[0.4em] text-white/80 mb-6 drop-shadow-md">
            Mouleeta Couture
          </span>
          <h1 className="font-jost font-light text-5xl sm:text-6xl md:text-[90px] text-white tracking-[0.1em] uppercase leading-[1.1] drop-shadow-xl max-w-5xl">
            The Complete <br /> Collection
          </h1>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none animate-bounce">
          <span className="font-metropolis text-[9px] uppercase tracking-[0.3em] text-white/70">Scroll to View</span>
          <ChevronDown size={20} strokeWidth={1} className="text-white/70" />
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 md:py-32">
        {/* The Staggered Waterfall Grid */}
        {formattedProducts && formattedProducts.length > 0 ? (
          <div className="
            grid grid-cols-2 md:grid-cols-3 
            gap-x-4 gap-y-12 md:gap-x-12 md:gap-y-24 
            
            /* Mobile Stagger: Push down the right column (even items) */
            [&>*:nth-child(2n)]:translate-y-12
            
            /* Desktop Stagger: Reset mobile, and push down the middle column (3n+2) */
            md:[&>*:nth-child(2n)]:translate-y-0
            md:[&>*:nth-child(3n+2)]:translate-y-24
          ">
            {formattedProducts.map((productEdge) => {
              const product = productEdge.node;
              return (
                <div key={product.id} className="w-full relative group">
                  <SandboxProductCard product={product} lightBg={true} isSpringCollection={false} />
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="h-[50vh] flex flex-col items-center justify-center">
            <p className="font-metropolis text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 mb-2">
              Warehouse Empty
            </p>
            <p className="font-jost text-sm text-[#1A1A1A]/70 font-light tracking-wide">
              No active products found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
