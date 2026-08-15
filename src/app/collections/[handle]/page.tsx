import type { Metadata } from 'next';
import { getCollectionByHandle, getCollectionProducts } from '@/lib/shopify';
import SandboxProductCard from '@/components/SandboxProductCard';
import HeroImageFader from '@/components/HeroImageFader';
import { ChevronDown } from 'lucide-react';

interface Props {
  params: Promise<{ handle: string }>;
}

const siteUrl = 'https://mouleeta.shop';

function titleFromHandle(handle: string) {
  return handle.replace(/-/g, ' ');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);
  const pageTitle = collection?.title || titleFromHandle(handle);
  const title = `${pageTitle} | MOULEETA`;
  const description = collection?.description || `Explore ${pageTitle} from MOULEETA's consciously crafted collection.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/collections/${handle}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/collections/${handle}`,
      siteName: 'MOULEETA',
      type: 'website',
      images: collection?.image?.url
        ? [
            {
              url: collection.image.url,
              width: 1200,
              height: 630,
              alt: pageTitle,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: collection?.image?.url ? [collection.image.url] : undefined,
    },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params; 
  const products = await getCollectionProducts(handle);

  if (!products || products.length === 0) {
    return (
      <div className="py-32 text-center min-h-[60vh] flex flex-col justify-center items-center bg-[#FAF9F6]">
        <h1 className="text-2xl tracking-widest uppercase mb-4 font-light">Collection Not Found</h1>
      </div>
    );
  }

  const pageTitle = titleFromHandle(handle);

  // Get first image from the first 5 products to fade through
  const heroImages = products
    .slice(0, 5)
    .map(p => p.node.images?.edges?.[0]?.node?.url)
    .filter(Boolean) as string[];

  // Fallback if no images found
  if (heroImages.length === 0) heroImages.push('/placeholder.png');

  // Format products for SandboxProductCard
  const formattedProducts = products.map(p => ({
    node: {
      id: p.node.id,
      title: p.node.title,
      handle: p.node.handle,
      description: p.node.description,
      priceRange: {
        minVariantPrice: {
          amount: p.node.priceRange.minVariantPrice.amount,
          currencyCode: p.node.priceRange.minVariantPrice.currencyCode || 'INR'
        }
      },
      images: p.node.images,
      featuredImage: p.node.images?.edges?.[0]?.node ? { url: p.node.images.edges[0].node.url } : undefined,
      variants: p.node.variants
    }
  }));

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* 100vh Immersive Hero Section */}
      <div className="relative w-full h-[100dvh] bg-[#1A1A1A]">
        <HeroImageFader 
          images={heroImages} 
          interval={3500} 
          altText={`The ${pageTitle} Collection`} 
        />
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

        {/* Hero Title */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
          <span className="font-metropolis font-medium text-[10px] md:text-[12px] uppercase tracking-[0.4em] text-white/80 mb-6 drop-shadow-md">
            Mouleeta Collection
          </span>
          <h1 className="font-jost font-light text-5xl sm:text-6xl md:text-[90px] text-white tracking-[0.1em] uppercase leading-[1.1] drop-shadow-xl max-w-5xl">
            {pageTitle}
          </h1>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none animate-bounce">
          <span className="font-metropolis text-[9px] uppercase tracking-[0.3em] text-white/70">Scroll to View</span>
          <ChevronDown size={20} strokeWidth={1} className="text-white/70" />
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 md:py-32">
        {/* Dynamic Grid Layout */}
        {formattedProducts.length === 1 ? (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="w-full max-w-sm mb-16">
              {/* @ts-ignore */}
              <SandboxProductCard product={formattedProducts[0].node} lightBg={true} isSpringCollection={false} />
            </div>
            <div className="py-8 px-12 border border-onyx/10 bg-white/50 backdrop-blur-sm text-center max-w-lg mx-auto">
              <h3 className="font-jost text-[11px] font-semibold uppercase tracking-[0.25em] text-[#1A1A1A]">More styles arriving soon</h3>
              <p className="font-inter text-xs text-stone-500 mt-3 tracking-wide">We are currently crafting new pieces for this collection. Sign up for our newsletter to be notified of our next drop.</p>
            </div>
          </div>
        ) : (
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
                  {/* @ts-ignore */}
                  <SandboxProductCard product={product} lightBg={true} isSpringCollection={false} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
