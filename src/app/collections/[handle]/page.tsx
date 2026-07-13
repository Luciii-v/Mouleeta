import type { Metadata } from 'next';
import { getCollectionByHandle, getCollectionProducts } from '@/lib/shopify';
import ProductCard from '@/components/ProductCard';
import AnimatedGrid from '@/components/AnimatedGrid';

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

  return (
    <div className="py-24 bg-[#FAF9F6] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        
        {/* Dynamic header */}
        <header className="mb-20 text-center">
          <span className="font-metropolis font-light text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#1A1A1A]/50 block mb-3">
            Collection
          </span>
          <h1 className="font-jost font-light text-2xl sm:text-3xl md:text-[36px] text-[#1A1A1A] tracking-[0.25em] uppercase leading-none">
            {pageTitle}
          </h1>
        </header>

        {/* Dynamic Grid Layout */}
        {products.length === 1 ? (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="w-full max-w-sm mb-16">
              <ProductCard product={products[0].node} lightBg={true} />
            </div>
            <div className="py-8 px-12 border border-onyx/10 bg-white/50 backdrop-blur-sm text-center max-w-lg mx-auto">
              <h3 className="font-jost text-[11px] font-semibold uppercase tracking-[0.25em] text-[#1A1A1A]">More styles arriving soon</h3>
              <p className="font-inter text-xs text-stone-500 mt-3 tracking-wide">We are currently crafting new pieces for this collection. Sign up for our newsletter to be notified of our next drop.</p>
            </div>
          </div>
        ) : (
          <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
            {products.map((edge) => (
              <ProductCard key={edge.node.id} product={edge.node} lightBg={true} />
            ))}
          </AnimatedGrid>
        )}
      </div>
    </div>
  );
}
